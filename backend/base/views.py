from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.helpers import complete_social_login
from allauth.socialaccount.models import SocialApp
from rest_framework_simplejwt.tokens import RefreshToken
import random
from django.db import IntegrityError
from django.db import transaction
import jwt
from allauth.socialaccount.models import SocialAccount
import requests
import logging
logger = logging.getLogger(__name__)

from rest_framework.pagination import PageNumberPagination

from .models import MyUser, Post
from .serializers import MyUserProfileSerializer, UserRegisterSerializer, PostSerializer, UserSerializer, UserSerializerSearch

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

class CustomGoogleOAuth2Adapter(GoogleOAuth2Adapter):
    def complete_login(self, request, app, token, response):
        return self.get_provider().sociallogin_from_response(request, response)

class CustomOAuth2Token:
    def __init__(self, token, access_token):
        self.token = token
        self.access_token = access_token

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def authenticated(request):
    return Response({'authenticated':True})

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'success':True})
    return Response(serializer.errors)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    auth_code = request.data.get('code')
    if not auth_code:
        logger.error("No authorization code provided")
        return Response({'error': 'No code provided'}, status=400)

    logger.info(f"Received auth_code: {auth_code}")

    try:
        app = SocialApp.objects.get(provider='google')
        client_id = app.client_id
        client_secret = app.secret
        redirect_uri = "http://localhost:3000"
        token_url = "https://oauth2.googleapis.com/token"
        token_payload = {
            "code": auth_code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        }
        logger.info(f"Sending token payload: {token_payload}")
        token_response = requests.post(token_url, data=token_payload)
        if token_response.status_code != 200:
            logger.error(f"Token exchange failed: {token_response.text}")
            return Response({'error': 'Failed to exchange code for token'}, status=400)

        token_data = token_response.json()
        logger.info(f"Token response: {token_data}")
        access_token = token_data.get("access_token")
        id_token = token_data.get("id_token")
        if not access_token or not id_token:
            logger.error("Missing access_token or id_token")
            return Response({'error': 'Invalid token response'}, status=400)

        # Decode id_token to get user info
        decoded_id_token = jwt.decode(id_token, options={"verify_signature": False})  # No signature check for simplicity
        logger.info(f"Decoded id_token: {decoded_id_token}")
        email = decoded_id_token.get("email")
        if not email:
            logger.error("No email in id_token")
            return Response({'error': 'Email not found in token'}, status=400)

        google_uid = decoded_id_token.get("sub")
        social_account = SocialAccount.objects.filter(uid=google_uid, provider='google').first()

        if social_account:
            user = social_account.user
            logger.info(f"Returning user: {user.username}")
        else:
            base_username = email.split("@")[0]
            while True:
                random_nums = str(random.randint(1000, 9999))
                username = f"{base_username}-{random_nums}"
                logger.info(f"Trying username: {username}")
                if not MyUser.objects.filter(username=username).exists():
                    break

            user = MyUser(
                username=username,
                email=email,
                first_name=decoded_id_token.get("given_name", ""),
                last_name=decoded_id_token.get("family_name", "")
            )
            user.set_unusable_password()
            try:
                with transaction.atomic():
                    user.save()
                    SocialAccount.objects.create(user=user, provider='google', uid=google_uid)
                logger.info(f"New user created: {username}")
            except IntegrityError:
                logger.error(f"Username {username} collided")
                return Response({'error': 'Unable to create unique username'}, status=400)

        adapter = GoogleOAuth2Adapter(request)
        social_login = adapter.complete_login(request, app, token=access_token, response=token_data)
        logger.info("Completing social login")
        complete_social_login(request, social_login)

        if not request.user.is_authenticated:
            logger.error("User not authenticated after login")
            return Response({'error': 'Authentication failed'}, status=401)

        refresh = RefreshToken.for_user(user)
        access_token_jwt = str(refresh.access_token)
        refresh_token = str(refresh)

        res = Response({
            'success': True,
            'user': {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                "profile_image": user.profile_image.url if user.profile_image else None
            }
        })
        res.set_cookie('access_token', access_token_jwt, httponly=True, secure=True, samesite='None')
        res.set_cookie('refresh_token', refresh_token, httponly=True, secure=True, samesite='None')
        logger.info(f"User {user.username} logged in successfully")
        return res

    except SocialApp.DoesNotExist:
        logger.error("Google social app not configured")
        return Response({'error': 'Google app not configured'}, status=400)
    except Exception as e:
        logger.error(f"Google login error: {str(e)}", exc_info=True)
        return Response({'error': str(e)}, status=400)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']
            username = request.data['username']
            try:
                user = MyUser.objects.get(username=username)
            except MyUser.DoesNotExist:
                return Response({'error':'users has not found'})

            res = Response()
            res.data = {'success':True, 
                        "user": {
                            "username":user.username,
                            "bio":user.bio,
                            "email":user.email,
                            "first_name":user.first_name,
                            "last_name":user.last_name,
                            "profile_image": user.profile_image.url if user.profile_image else None
                        }}

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            res.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            return res
        except:
            return Response({'success':False})
        
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens['access']
            res = Response()
            res.data = {'success':True}
            res.set_cookie(
                    key='access_token',
                    value=access_token,
                    httponly=True,
                    secure=True,
                    samesite='None',
                    path='/'
                )
            return res
        except:
            return Response({'success':False})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile_data(request, pk):
    try:
        try:
            user = MyUser.objects.get(username=pk)
        except MyUser.DoesNotExist:
            return Response({'error': 'user does not exist'})
        
        serializer = MyUserProfileSerializer(user, many=False)

        following = False
        if request.user in user.followers.all():
            following = True

        return Response({**serializer.data, 'is_our_profile': request.user.username == user.username, 'isFollowing': following})
    except:
        return Response({'error': 'error getting user data'})
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggleFollow(request):
    try:
        try:
            my_user = MyUser.objects.get(username=request.user.username)
            user_to_follow = MyUser.objects.get(username=request.data['username'])
        except MyUser.DoesNotExist:
            return Response({'error':'users does not exist'})
        
        if my_user in user_to_follow.followers.all():
            user_to_follow.followers.remove(my_user)
            return Response({'now_following':False})
        else:
            user_to_follow.followers.add(my_user)
            return Response({'now_following':True})
    except:
        return Response({'error':'error following user'})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_posts(request, pk):
    try:
        user = MyUser.objects.get(username=pk)
        my_user = MyUser.objects.get(username=request.user.username)
        posts = user.posts.all().order_by('-created_at')

        paginator = PageNumberPagination()
        paginator.page_size = 4
        result_pages = paginator.paginate_queryset(posts, request)

        serializer = PostSerializer(result_pages, many=True)

        data = []
        for post in serializer.data:
            liked = my_user.username in post.get('likes', [])
            data.append({**post, 'liked': liked})

        return paginator.get_paginated_response(data)
    except MyUser.DoesNotExist:
        return Response({'error': 'user does not exist'}, status=404)
    except Exception as e:
        return Response({'error': f'Error getting posts: {str(e)}'}, status=500)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggleLike(request):
    try:
        try:
            post = Post.objects.get(id=request.data['id'])
        except Post.DoesNotExist:
            return Response({'error': 'post is not found'})
        
        try:
            user = MyUser.objects.get(username=request.user.username)
        except MyUser.DoesNotExist:
            return Response({'error':'users has not found'})
        
        if user in post.likes.all():
            post.likes.remove(user)
            return Response({'now_liked':False})
        else:
            post.likes.add(user)
            return Response({'now_liked':True})
    except:
        return Response({'error': 'error liking the post'})
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    try:
        data = request.data

        try:
            user = MyUser.objects.get(username=request.user.username)
        except MyUser.DoesNotExist:
            return Response({'error': 'user does not exist'})

        post = Post.objects.create(
            user=user,
            description=data['description']
        )

        serializer = PostSerializer(post, many=False)

        return Response({'success':True})
    except:
        return Response({'error': 'error creating post'})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPosts(request):
    try:
        posts = Post.objects.all().order_by('-created_at')

        paginator = PageNumberPagination()
        paginator.page_size = 4

        result_pages = paginator.paginate_queryset(posts, request)
        serializer = PostSerializer(result_pages, many=True)

        try:
            my_user = MyUser.objects.get(username=request.user.username)
        except MyUser.DoesNotExist:
            return Response({'error':'users has not found'})

        data = []
        for post in serializer.data:
            liked = my_user.username in post.get('likes', [])
            data.append({**post, 'liked': liked})

        return paginator.get_paginated_response(data)
    except:
        return Response({'error': 'failed loading posts'})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users(request):
    query = request.query_params.get('query', '')
    users = MyUser.objects.filter(username__icontains=query)
    serializer = UserSerializerSearch(users, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_details(request):
    data = request.data
    try:
        user = MyUser.objects.get(username=request.user.username)
    except MyUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    serializer = UserSerializer(user, data, partial=True)
    if serializer.is_valid():
        try:
            serializer.save()
            profile_image_url = user.profile_image.url if user.profile_image and hasattr(user.profile_image, 'url') else None
            return Response({
                'success': True,
                'profile_image': profile_image_url,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'bio': user.bio
            })
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    return Response({'success': False, 'errors': serializer.errors}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):

    try:
        res = Response()
        res.data = {'success':True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')
        return res
    except:
        return Response({'success':False})

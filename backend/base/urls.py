from django.urls import path, include

from .views import (get_user_profile_data, CustomTokenObtainPairView, 
                    CustomTokenRefreshView, register, authenticated, toggleFollow, 
                    get_users_posts, toggleLike, create_post, getPosts, search_users, logout, update_user_details,
                    google_login)

urlpatterns = [
    path('user_data/<str:pk>/', get_user_profile_data),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register),
    path('authenticated/', authenticated),
    path('toggle-follow/', toggleFollow),
    path('posts/<str:pk>/', get_users_posts),
    path('toggle-like/', toggleLike),
    path('create-post/', create_post),
    path('get-posts/', getPosts),
    path('search/', search_users),
    path('update-user/', update_user_details),
    path('logout/', logout),
    path('auth/google/', google_login, name='google_login'),
    path('accounts/', include('allauth.urls')),
]
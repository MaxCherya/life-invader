from rest_framework import serializers
from .models import MyUser, Post

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = MyUser
        fields = ['username', 'email', 'first_name', 'last_name', 'password']

    def validate_email(self, value):
        if MyUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already taken.")
        return value

    def validate_username(self, value):
        if MyUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def create(self, validated_data):
        user = MyUser(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class MyUserProfileSerializer(serializers.ModelSerializer):

    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = MyUser
        fields = ['username', 'bio', 'profile_image', 'follower_count', 'following_count']

    def get_follower_count(self, obj):
        return obj.followers.count()
    
    def get_following_count(self, obj):
        return obj.following.count()
    
class PostSerializer(serializers.ModelSerializer):

    username = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'username', 'profile_image', 'description', 'formatted_date', 'likes', 'like_count']

    def get_username(self, obj):
        return obj.user.username
    
    def get_like_count(self, obj):
        return obj.likes.count()
    
    def get_formatted_date(self, obj):
        return obj.created_at.strftime('%Y-%m-%d %H:%M:%S')
    
    def get_profile_image(self, obj):
        return obj.user.profile_image.url if obj.user.profile_image else None
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['profile_image', 'bio', 'email', 'first_name', 'last_name']

class UserSerializerSearch(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['username', 'profile_image', 'bio', 'email', 'first_name', 'last_name']
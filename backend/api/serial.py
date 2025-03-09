from rest_framework import serializers
# from backend.api import authentication
from django.contrib.auth import authenticate
from crouirouge.models import User,Family,Announcement,Members,Fellowership,RedcrossActivities,FirstAidCourse

class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()  # Add this line
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "password", "profile_image"]
        extra_kwargs = {
            "id": {"read_only": True, "required": False},
            "password": {"write_only": True, "required": False},
            "role": {"read_only": True, "required": False},
            "profile_image": {"required": False},
        }

    def get_profile_image(self, obj):
        if obj.profile_image:  # Check if profile_image exists
            return self.context['request'].build_absolute_uri(obj.profile_image.url)
        return None  # Return None if no image is set

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user 

class FamilySerializer(serializers.ModelSerializer):
      class Meta:
          model=Family
          fields=["id","name"]
class MembersSerializer(serializers.ModelSerializer):
     class Meta:
          model=Members
          fields=["id"," family","first_name"," last_name","email"]           
class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model=Announcement
        fields=["id","title","text","created"]
        extra_kwargs={"id":{"read_only":True,"required":False}}


class Felloweshipserializer(serializers.ModelSerializer):
     class Meta:
          model=Fellowership
          fields=["id","title","description","fellowership_image"]
          extra_kwargs={"id":{"read_only":True,"required":False}}    

class Redcrossactivitiesserializer(serializers.ModelSerializer):
     class Meta:
          model=RedcrossActivities
          fields=["id","title","description","redcross_activities_image"]
          extra_kwargs={"id":{"read_only":True,"required":False}}  

class FirstAidCourseSerializer(serializers.ModelSerializer):
     class Meta:
          model=FirstAidCourse
          fields=["id","title","description","first_id_video"]
          extra_kwargs={"id":{"read_only":True,"required":False}}  




class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(email=email, password=password)
        if user is None:
            raise serializers.ValidationError('Invalid email or password')

        attrs['user'] = user
        return attrs                   

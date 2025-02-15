from rest_framework import serializers
from crouirouge.models import User,Family,Announcement,Members,Fellowership,RedcrossActivities,FirstAidCourse

class UserSerializer(serializers.ModelSerializer):
      class Meta:
            model=User
            fields=["id","username","email","role","password"]
            extra_kwargs={"id":{"read_only":True,"required":False},"password":{"write_only":True,"required":False}}
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

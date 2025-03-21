from rest_framework import serializers
# from backend.api import authentication
from django.contrib.auth import authenticate
from crouirouge.models import  (User,Family,Announcement
                                ,Members,Fellowership,
                                RedcrossActivities,
                                FirstAidCourse,Address,Generalinformation,BloodDonation)

class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False)  # Make it writable

    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "first_name", "last_name", "password", "profile_image"]
        extra_kwargs = {
            "id": {"read_only": True, "required": False},
            "password": {"write_only": True, "required": False},
            "role": {"read_only": True, "required": False},
            "first_name": {"read_only": True, "required": False},
            "last_name": {"read_only": True, "required": False},
            # Remove "profile_image" from extra_kwargs to make it writable
        }

    def get_profile_image(self, obj):
        if obj.profile_image:  # Check if profile_image exists
            return self.context['request'].build_absolute_uri(obj.profile_image.url)
        return None  # Return None if no image is set

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        # Handle profile image update
        profile_image = validated_data.pop('profile_image', None)
        if profile_image:
            instance.profile_image = profile_image

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

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



class AddressSerializer(serializers.ModelSerializer):
           class Meta:
                model=Address
                fields=["id","user","province","district","sector","cell","village"]
                extra_kwargs={"id":{"read_only":        
                                        True,"required":False}}




class BloodDonationSerializer(serializers.ModelSerializer):
           class Meta:
                model=BloodDonation
                fields=["id","user","donated_times"]
                extra_kwargs={"id":{"read_only":True,"required":False}}


class GeneralinformationSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    blood_donated = BloodDonationSerializer()

    class Meta:
        model = Generalinformation
        fields = '__all__'
        extra_kwargs = {"id": {"read_only": True, "required": False}}

    def create(self, validated_data):
        address_data = validated_data.pop('address')
        blood_donated_data = validated_data.pop('blood_donated')

        # Log the incoming data
        print("Address Data:", address_data)
        print("Blood Donation Data:", blood_donated_data)
        print("General Information Data:", validated_data)

        address_obj = Address.objects.create(**address_data)
        blood_donation_obj = BloodDonation.objects.create(**blood_donated_data)
        general_information_obj = Generalinformation.objects.create(
            address=address_obj,
            blood_donated=blood_donation_obj,
            **validated_data
        )
        return general_information_obj
    def update(self, instance, validated_data):
        # Update address
        address_data = validated_data.pop('address', None)
        if address_data:
            for attr, value in address_data.items():
                setattr(instance.address, attr, value)
            instance.address.save()
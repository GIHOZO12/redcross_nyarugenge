from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework import generics

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt,csrf_protect,ensure_csrf_cookie
from django.shortcuts import get_object_or_404
from crouirouge.models import User,Family,Announcement,Members,Fellowership,RedcrossActivities,FirstAidCourse
from .serial import UserSerializer,FamilySerializer,AnnouncementSerializer,MembersSerializer,Felloweshipserializer,Redcrossactivitiesserializer,FirstAidCourseSerializer
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView 
from rest_framework_simplejwt.tokens import RefreshToken 
from .serial import LoginSerializer

@api_view(['GET','POST'])
def user_list(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET','POST'])
def family_list(request,name=None):
    if request.method == 'GET':
        if name is not None: 
            famill=get_object_or_404(Family)
            serializer=FamilySerializer(famill)
        else:    
          family = Family.objects.all()
          serializer = FamilySerializer(family, many=True)
          return Response(serializer.data)
    elif request.method == 'POST':
        serializer = FamilySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET','POST'])
def members_list(request):
    if request.method =="GET":
        member=Members.objects.all()
        serializer=MembersSerializer(member,many=True)
        return Response(serializer.data)
    elif request.method=="post":
        serializer=MembersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,201)
        return Response(serializer.errors,401)    
@api_view(['GET','POST'])
def announcement_list(request):
    if request.method == 'GET':
        announcement = Announcement.objects.all()
        serializer = AnnouncementSerializer(announcement, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = AnnouncementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET','POST'])
def felloweship_list(request):
    if request.method == 'GET':
        felloweship = Fellowership.objects.all()
        serializer = Felloweshipserializer(felloweship, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = Felloweshipserializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET','POST'])
def redcrossactivities_list(request):
    if request.method == 'GET':
        redcrossactivities = RedcrossActivities.objects.all()
        serializer = Redcrossactivitiesserializer(redcrossactivities, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = Redcrossactivitiesserializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET','POST'])

def first_id_course_list(request):
    if request.method == 'GET':
        first_aid_course = FirstAidCourse.objects.all()
        serializer=FirstAidCourseSerializer(first_aid_course,many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = FirstAidCourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        res = Response()
        try:
            response = super().post(request, *args, **kwargs)
            token = response.data
            access_token = token["access"]
            refresh_token = token["refresh"]

            res.data = {"success": True}
            res.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite="None", path="/")
            res.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True, samesite="None", path="/")
            return res

        except Exception as e:
            print("Error in CustomTokenObtainPairView:", e)
            res.data = {"success": False}
            return res
  
        
class CustomRefreshToken(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            print("Received Refresh Token:", refresh_token)
            
            if not refresh_token:
                return Response({"refreshed": False, "message": "No refresh token in cookies"}, status=400)

            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)
            token = response.data
            access_token = token["access"]

            res = Response()
            res.data = {"refreshed": True}
            res.set_cookie(key='access_token', value=access_token, httponly=True, secure=True, samesite="None", path="/")
            return res

        except Exception as e:
            print("Error in CustomRefreshToken:", e)  # Debugging
            return Response({"refreshed": False, "message": str(e)}, status=500)
          
@csrf_exempt          
@api_view(["POST"])
def logout_view(request):
    try:
        res = Response()    
        res.data={"success":True}
        res.delete_cookie("access_token" ,path="/",samesite="None")
        
        res.delete_cookie("refresh_token" ,path="/",samesite="None")
        return res

    except:
        return Response({"success":False},status=500)
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)








class Createuserview(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email)  # Find user by email
            user = authenticate(email=user.email, password=password)
             
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "Login successful",
                    "username": user.username,
                    "is_superuser": user.is_superuser,  # Add this
                    "is_staff": user.is_staff,  # Add this
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }, status=status.HTTP_200_OK)
            return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        

class LogoutView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @csrf_protect
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if not refresh_token:
                return Response({"success": False, "message": "No refresh token found."}, status=400)

            token = RefreshToken(refresh_token)
            token.blacklist()

            res = Response({"success": True, "message": "Logged out successfully."})
            res.delete_cookie("access_token", path="/", samesite="None", secure=True)
            res.delete_cookie("refresh_token", path="/", samesite="None", secure=True)

            return res
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=500)
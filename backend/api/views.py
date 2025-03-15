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

from django.http import HttpResponse
from reportlab.pdfgen import canvas
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt,csrf_protect,ensure_csrf_cookie
from django.shortcuts import get_object_or_404
from crouirouge.models import (User,Family,Announcement,Members,
                               Fellowership,
                               RedcrossActivities,
                               FirstAidCourse,Address,BloodDonation,Generalinformation,)
from .serial import (UserSerializer,FamilySerializer,
                     AnnouncementSerializer,MembersSerializer,
                     Felloweshipserializer,
                     Redcrossactivitiesserializer,
                     FirstAidCourseSerializer,GeneralinformationSerializer)
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


from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

@api_view(['POST'])
@authentication_classes([JWTAuthentication])  # Use JWT authentication
@permission_classes([IsAuthenticated])  # Require authenticated users
def add_user_info(request):
    print(request.data)  # Log incoming data
    try:
        # Fetch the existing user instance
        user = request.user  # Get the authenticated user
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Use partial=True to allow partial updates
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    print(serializer.errors)  # Log validation errors
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





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
                    "role": user.role,
                    "is_superuser": user.is_superuser,
                    "is_staff": user.is_staff,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }, status=status.HTTP_200_OK)
            return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)



class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")
        if new_password != confirm_password:
            return Response({"message": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email__exact=email)
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)


        


        
@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access this endpoint

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"success": False, "message": "No refresh token found."}, status=status.HTTP_400_BAD_REQUEST)

            # Verify the refresh token
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()  # Blacklist the refresh token
            except Exception as e:
                return Response({"success": False, "message": "Invalid or expired refresh token."}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"success": True, "message": "Logged out successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        




class GeneralInformation(APIView):
    permission_classes = [AllowAny]
    def post(self,request,*args,**kwargs):
        serializer=GeneralinformationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)



class EditGeneralInformation(APIView):
    permission_classes = [IsAuthenticated]
    def get_object(self, user_id):
        try:
            return Generalinformation.objects.get(user_id=user_id)
        except Generalinformation.DoesNotExist:
            return None

    def get(self, request, user_id, *args, **kwargs):
        general_info = self.get_object(user_id)
        if general_info is None:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


        serializer = GeneralinformationSerializer(general_info)
        return Response(serializer.data)
    def put(self, request, user_id, *args, **kwargs):
        general_info = self.get_object(user_id)
        if general_info is None:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = GeneralinformationSerializer(general_info, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProofOfRegistrationView(APIView):
    def get(self, request, user_id, *args, **kwargs):
        try:
            # Fetch the user's registration information
            general_info = Generalinformation.objects.get(user_id=user_id)

            # Create the PDF response
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="proof_of_registration_{user_id}.pdf"'

            p = canvas.Canvas(response)
            p.setFont("Helvetica-Bold", 14)
            p.drawString(100, 750, "Proof of Registration")
            p.setFont("Helvetica", 12)

            # Add user details to the PDF
            p.drawString(100, 720, f"Name: {general_info.user.username}")
            p.drawString(100, 700, f"National ID: {general_info.nationalId}")
            p.drawString(100, 680, f"Department: {general_info.department}")
            p.drawString(100, 660, "Thank you for registering!")

            # Save and return the PDF
            p.showPage()
            p.save()

            return response

        except ObjectDoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
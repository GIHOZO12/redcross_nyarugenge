from io import BytesIO
import os
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from reportlab.lib.pagesizes import letter
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from reportlab.lib.utils import ImageReader
from io import BytesIO
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework import generics,permissions

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
                               RedcrossActivities,RequestMembership,
                               FirstAidCourse,Address,BloodDonation,Generalinformation,)
from .serial import (UserSerializer,FamilySerializer,
                     AnnouncementSerializer,MembersSerializer,
                     Felloweshipserializer,RequestMembershipSerializer,
                     Redcrossactivitiesserializer,
                     FirstAidCourseSerializer,GeneralinformationSerializer)
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView 
from rest_framework_simplejwt.tokens import RefreshToken 
from .serial import LoginSerializer





class RequestMembershipView(generics.CreateAPIView):
    queryset = RequestMembership.objects.all()
    serializer_class = RequestMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Check if user already has a pending request
        if RequestMembership.objects.filter(user=request.user, status='pending').exists():
            return Response(
                {'detail': 'You already have a pending membership request.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user is already a member
        if request.user.role in ['Member', 'admin']:
            return Response(
                {'detail': 'You are already a member.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {'detail': 'Membership request submitted successfully.'},
            status=status.HTTP_201_CREATED,
            headers=headers
        )






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
        
class ChangeProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "message": "Profile picture updated successfully", "data": serializer.data})
        else:
            return Response({"success": False, "message": "Failed to update profile picture", "errors": serializer.errors}, status=400)
    






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

            # Create a BytesIO buffer to store the PDF
            buffer = BytesIO()

            # Create the PDF object, using the buffer as its "file"
            p = canvas.Canvas(buffer, pagesize=letter)
            p.setTitle("Proof of Registration")
            logo_path = os.path.join(settings.STATIC_ROOT, 'logo.png')  # Path to the logo image
            print("Logo Path:", logo_path)  # Debugging: Print the logo path
            if os.path.exists(logo_path):
                print("Logo exists at:", logo_path)  # Debugging: Confirm the logo exists
                try:
                    logo = ImageReader(logo_path)
                    p.drawImage(logo, 50, 750, width=50, height=50)  # Draw the logo at (50, 750)
                except Exception as e:
                    print("Error loading logo:", e)  # Debugging: Log any errors
            else:
                print("Logo not found at:", logo_path)  # Debugging: Log if the logo is missing

            # Add the text "Nyarugenge Red Cross" next to the logo
            p.setFont("Helvetica-Bold", 16)
            p.drawString(110, 770, "Nyarugenge Red Cross")  # Draw text at (110, 770)

            # Add the title "Proof of Registration"
            p.setFont("Helvetica-Bold", 14)
            p.drawString(100, 720, "Proof of Registration")

            # Add user details to the PDF
            p.setFont("Helvetica", 12)
            p.drawString(100, 690, f"Name: {general_info.user.username}")
            p.drawString(100, 670, f"National ID: {general_info.nationalId}")
            p.drawString(100, 650, f"Department: {general_info.department}")
            p.drawString(100, 630, "Thank you for registering!")

            # Close the PDF object cleanly
            p.showPage()
            p.save()

            # File response with the PDF
            buffer.seek(0)
            response = HttpResponse(buffer, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="proof_of_registration_{user_id}.pdf"'
            return response

        except Generalinformation.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class Admin_all_generalinformation(APIView):
    permission_classes = [IsAdminUser] 
    def get(self,request,*args,**kwargs):
        general_info=Generalinformation.objects.all()
        serializer=GeneralinformationSerializer(general_info,many=True)
        return Response(serializer.data)
  
def download_single_user_info(request, user_id):
    try:
        user = Generalinformation.objects.get(id=user_id)
    except Generalinformation.DoesNotExist:
        return HttpResponse("User not found", status=404)

    # Create a BytesIO buffer to store the PDF
    buffer = BytesIO()

    # Create the PDF object, using the buffer as its "file"
    p = canvas.Canvas(buffer, pagesize=letter)

    # Set the PDF title
    p.setTitle(f"User Information for {user.user.username}")

    # Add the logo and text at the top
    logo_path = os.path.join(settings.STATIC_ROOT,'logo.png')  # Path to the logo image
    if os.path.exists(logo_path):
        logo = ImageReader(logo_path)
        p.drawImage(logo, 50, 750, width=50, height=50)  # Draw the logo at (50, 750)

    # Add the text "Nyarugenge Red Cross" next to the logo
    p.setFont("Helvetica-Bold", 16)
    p.drawString(110, 770, "Nyarugenge Red Cross")  # Draw text at (110, 770)

    # Add user information below the logo and text
    p.setFont("Helvetica", 12)
    p.drawString(100, 700, f"User Information for {user.user.username}")
    p.drawString(100, 680, f"ID: {user.id}")
    p.drawString(100, 660, f"Username: {user.user.username}")
    p.drawString(100, 640, f"Gender: {user.gender}")
    p.drawString(100, 620, f"National ID: {user.nationalId}")
    p.drawString(100, 600, f"Department: {user.department}")
    p.drawString(100, 580, f"Province: {user.address.province}")
    p.drawString(100, 560, f"District: {user.address.district}")
    p.drawString(100, 540, f"Sector: {user.address.sector}")
    p.drawString(100, 520, f"Cell: {user.address.cell}")
    p.drawString(100, 500, f"Village: {user.address.village}")
    p.drawString(100, 480, f"Blood Donated: {user.blood_donated.donated}")
    p.drawString(100, 460, f"Donated Times: {user.blood_donated.donated_times}")

    # Close the PDF object cleanly
    p.showPage()
    p.save()

    # File response with the PDF
    buffer.seek(0)
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="user_{user.id}_info.pdf"'
    return response
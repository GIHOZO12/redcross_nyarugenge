from ast import Subscript
from email.message import EmailMessage
import json
from django.utils.html import strip_tags
import logging
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.shortcuts import render,redirect,get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt,csrf_protect
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import authenticate,login,logout
from django.middleware.csrf import get_token
from django.core.files.storage import default_storage
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse

from django.views.decorators.csrf import ensure_csrf_cookie
from urllib.parse import urljoin

from crouirouge.models import (Family,Members, User,
                               FamilyActivities,Fellowership,
                               RedcrossActivities,
                               FirstAidCourse,Instructors,
                               RedcrossLeader,Messages,SubscribeNewslatter)

from crouirouge.models import Announcement

def anouncement_list(request):
    anounce=Announcement.objects.all()
    return JsonResponse(list(anounce),safe=False)




@csrf_exempt
def refresh_token(request):
    if request.method == "POST":
        refresh_token = request.POST.get("refresh_token")
        if not refresh_token:
            return JsonResponse({"status": False, "message": "Refresh token is required"})

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return JsonResponse({
                "status": True,
                "access_token": access_token,
            })
        except Exception as e:
            return JsonResponse({"status": False, "message": "Invalid refresh token"})
    return JsonResponse({"status": False, "message": "Invalid request method"})




@csrf_exempt
def login_info(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        try:
            user = User.objects.get(email=email)  # Get user by email
        except User.DoesNotExist:
            return JsonResponse({"status": False, "message": "Username or password incorrect"})

        if user.check_password(password):  # Check password
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return JsonResponse({
                "status": True,
                "message": "Login successful",
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": {
                    "username": user.username,
                    "is_superuser": user.is_superuser,
                    "is_staff": user.is_staff,
                },
                "redirect_url": "/"
            })
        else:
            return JsonResponse({"status": False, "message": "Username or password incorrect"})

    return JsonResponse({"status": False, "message": "Invalid request method"})





def user_get_token(request):
    return JsonResponse({"csrfToken": get_token(request)})

@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_auth(request):
    return Response({
        "is_authenticated": True,
        "user": {
            "username": request.user.username,
            "is_superuser": request.user.is_superuser,
            "is_staff": request.user.is_staff,
        },
    })

@csrf_exempt
def register(request):
    if request.method == 'POST':
        
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'status': False, 'message': 'Invalid JSON data'})

      
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Validate inputs
        if not username or not email or not password:
            return JsonResponse({'status': False, 'message': 'All fields are required'})

        # Check if username or email already exists
        if User.objects.filter(username=username).exists():
            return JsonResponse({'status': False, 'message': 'Username already exists'})
        if User.objects.filter(email=email).exists():
            return JsonResponse({'status': False, 'message': 'Email already exists'})

        # Create and save the user with hashed password
        user = User(username=username, email=email)
        user.set_password(password)  # Hash the password
        user.save()

        return JsonResponse({'status': True, 'message': 'Registration successful', 'redirect_url': '/login_info'})
    else:
        return JsonResponse({'status': False, 'message': 'Invalid request method'})


def test_cookie(request):
    response = JsonResponse({"status": True, "message": "Cookie test"})
    response.set_cookie("test_cookie", "test_value")  # Set a test cookie
    return response
    
@csrf_exempt
def logout_info(request):
    logout(request)
    return JsonResponse({'status':True,'message':'Logout successful','redirect_url':'/'})


def get_family_details(request, name):
    try:
        family = Family.objects.get(name=name)
        
        # Include father and mother details in the response
        family_data = {
            "name": family.name,
            "father": {
                "id": family.father.id if family.father else None,
                "username": family.father.username if family.father else None,
            },
            "mother": {
                "id": family.mother.id if family.mother else None,
                "username": family.mother.username if family.mother else None,
            },
        }
        return JsonResponse({"family": family_data}, status=200)
    except Family.DoesNotExist:
        return JsonResponse({"error": "Family not found."}, status=404)
    
def family_members(request, name):
    try:
        family = Family.objects.get(name=name)
        members = family.family.all()
        members_data = [
            {
                "first_name": member.first_name,
                "last_name": member.last_name,
                "email": member.email,
            }
            for member in members
        ]
        return JsonResponse({"members": members_data}, status=200)
    except Family.DoesNotExist:
        return JsonResponse({"error": "Family not found."}, status=404)
    


def family_activities(request, name):
    try:
        family = Family.objects.get(name=name)
        activities = family.family_activities.all().order_by('-created')
        activities_data = [
            {
                "id": activity.id,
                "title": activity.title,
                "text": activity.text,
                "activityImage":  urljoin(request.build_absolute_uri('/'), activity.activityImage.url) if activity.activityImage else None,
                "created": activity.created.strftime("%Y-%m-%d %H:%M:%S"),
            }
            for activity in activities
        ]
        return JsonResponse({"activities": activities_data}, status=200)
    except Family.DoesNotExist:
        return JsonResponse({"error": "Family not found."}, status=404)



def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})


@csrf_exempt
def create_activity(request):
    family_name = request.POST.get("family_name")
    title = request.POST.get("title")  # Ensure key names match frontend
    text = request.POST.get("text")
    activityImage = request.FILES.get("activity_image")

    if not family_name or not title or not text or not activityImage:
        return JsonResponse({'status': False, 'message': 'All fields are required'}, status=400)

    try:
        family = Family.objects.get(name=family_name)
        activity = FamilyActivities(family=family, title=title, text=text, activityImage=activityImage)
        activity.save()
        return JsonResponse({'status': True, 'message': 'Activity created successfully',"redirect_url":"/families/"+family_name}, status=201)

    except Family.DoesNotExist:
        return JsonResponse({'status': False, 'message': 'Family not found'}, status=404)

    except Exception as e:
        return JsonResponse({'status': False, 'message': str(e)}, status=500)



@csrf_exempt
def family_delete_activity(request,id):
    if request.method == "DELETE":
        activity = get_object_or_404(FamilyActivities, id=id)
        activity.delete()
        return JsonResponse({"status": True, "message": "Activity deleted successfully"}, status=200)
    
    return JsonResponse({"status": False, "message": "Activity delete failed"}, status=400)
   

@csrf_exempt
def update_activity(request, id):
    if request.method =="GET":
        activity = get_object_or_404(FamilyActivities, id=id)
        return JsonResponse({"status": True, "activity": {
            "id": activity.id,
            "title": activity.title,
            "text": activity.text,
            "activityImage": urljoin(request.build_absolute_uri('/'), activity.activityImage.url) if activity.activityImage else None,
            "created": activity.created.strftime("%Y-%m-%d %H:%M:%S"),
        }})
    
    if request.method =="POST":
        activity = get_object_or_404(FamilyActivities, id=id)
        title = request.POST.get("title")
        text = request.POST.get("text")
        activityImage = request.FILES.get("activity_image")

        if not title or not text or not activityImage:
            return JsonResponse({'status': False, 'message': 'All fields are required'}, status=400)

        activity.title = title
        activity.text = text
        activity.activityImage = activityImage
        activity.save()

        return JsonResponse({'status': True, 'message': 'Activity updated successfully',"redirect_url":"/families/"+activity.family.name}, status=200)
    return JsonResponse({"status": False, "message": "Invalid request method"}, status=405)



def latest_fellowership(request):
    fellowerships = Fellowership.objects.all().order_by('-created_at')[:3]
    
   

    data = []
    for fellowship in fellowerships:
        print("Processing Fellowship:", fellowship.title)  # Debugging

       
        image_url = None
        if fellowship.fellowership_image:
            try:
                image_url = request.build_absolute_uri(fellowship.fellowership_image.url)
            except Exception as e:
                print("Error getting image URL:", str(e))  # Debugging

        data.append({
            "title": fellowship.title,
            "description": fellowship.description,
            "fellowership_image": image_url,
            "created_at": fellowship.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        })

    print("Response Data:", data)  # Debugging
    return JsonResponse(data, safe=False)

 

from django.http import JsonResponse

def latest_redcross_activities(request):
    redcross_activities = RedcrossActivities.objects.all().order_by('-created_at')[:6]
    data = []

    for activity in redcross_activities:
        print("Processing Redcross Activity:", activity.title)  # Debugging
        image_url = None

        if activity.redcross_activities_image:
            try:
                image_url = request.build_absolute_uri(activity.redcross_activities_image.url)
            except Exception as e:
                print("Error getting image URL:", str(e))  # Debugging
        
        # ✅ Append data regardless of whether an image exists
        data.append({
            "title": activity.title,
            "description": activity.description,
            "redcross_activities_image": image_url,
            "created_at": activity.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        })

    print("Response Data:", data)  # Debugging
    return JsonResponse(data, safe=False)


def users_info(request):
    users = User.objects.all()
    data = []

    for user in users:

        data.append({           
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        })

   
    return JsonResponse(data, safe=False)



from django.core.mail import EmailMultiAlternatives
@csrf_exempt
def send_newsletter(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            subject = data.get('subject', 'Newsletter Update')
            html_content = data.get('html_content', '')
            plain_content = data.get('plain_content', strip_tags(html_content))
            
            subscribers = SubscribeNewslatter.objects.all()
            
            for subscriber in subscribers:
                # Create email with EmailMultiAlternatives
                email = EmailMultiAlternatives(
                    subject,
                    plain_content,
                    None,  # Uses DEFAULT_FROM_EMAIL
                    [subscriber.email]
                )
                email.attach_alternative(html_content, "text/html")
                email.send()
            
            return JsonResponse({
                'status': 'success', 
                'message': f'Newsletter sent to {subscribers.count()} subscribers'
            })
        
        except Exception as e:
            return JsonResponse({
                'status': 'error', 
                'message': str(e)
            }, status=500)
    
    return JsonResponse({
        'status': 'error', 
        'message': 'Invalid request method'
    }, status=400)




def admin_fellowships(request):
    felloweship=Fellowership.objects.all()
    data=[]
    for fellow in felloweship:
        image_url=None
        if fellow.fellowership_image:
            try:
                image_url=request.build_absolute_uri(fellow.fellowership_image.url)
            except Exception as e:
                print("Error:",str(e))
        data.append({
            "id": fellow.id,
            "title": fellow.title,
            "description": fellow.description,
            "fellowership_image": image_url,
        })
                
    return JsonResponse(data, safe=False)





@csrf_exempt  # ✅ Allow only for debugging (use proper CSRF handling in production)
def add_fellowship(request):
    if request.method == "POST":
        title = request.POST.get('title')
        description = request.POST.get('description')
        image = request.FILES.get('fellowership_image')

        if not title or not description or not image:
            return JsonResponse({'status': False, 'message': 'All fields are required',}, status=400)

        fellowship = Fellowership(title=title, description=description, fellowership_image=image)
        fellowship.save()

        return JsonResponse({'status': True, 'message': 'Fellowship added successfully','redirect_url': '/admin/myfelowership'}, status=201)

    return JsonResponse({'status': False, 'message': 'Invalid request method'}, status=405)


@ensure_csrf_cookie
def get_csrf_token(request):
   
    token = get_token(request)
    response = JsonResponse({"csrfToken": token})
    
    # ✅ Explicitly set CSRF cookie in response
    response.set_cookie(
        "csrftoken",
        token,
        httponly=False,  # ✅ Must be False to allow frontend access
        secure=False,  # Set to True if using HTTPS
        samesite="Lax",
    )

    return response




@ensure_csrf_cookie
def get_csrf_token_activity(request):
    token = get_token(request)
    response = JsonResponse({"csrfToken": token})

    # ✅ Explicitly set CSRF cookie
    response.set_cookie(
        "csrftoken",
        token,
        httponly=False,  # ✅ Must be False so frontend can access it
        secure=False,  # ✅ Set to True only in production (HTTPS)
        samesite="Lax",
    )

    print("CSRF Token Sent:", token)  # ✅ Debugging
    return response






def admin_activities(request):
    redcrossactivity = RedcrossActivities.objects.all()
    data = []
    for activity in redcrossactivity:
        image_url = None
        if activity.redcross_activities_image:
            try:
                image_url = request.build_absolute_uri(activity.redcross_activities_image.url)
            except Exception as e:
                print("Error:", str(e))
        data.append({
            "id":activity.id,
            "title": activity.title,
            "description": activity.description,
            "redcross_activities_image": image_url,
        })
  
    return JsonResponse(data, safe=False)




@csrf_exempt 
def admin_add_activity(request):
    if request.method == "POST":
        csrfToken = request.META.get('HTTP_X_CSRFTOKEN')
        print("CSRF Token in request:", csrfToken)
        print("CSRF Token in cookies:", request.COOKIES.get('csrftoken'))

        title = request.POST.get("title")
        description = request.POST.get("description")
        image = request.FILES.get("redcross_activities_image")
        if not title or not description or not image:
            return JsonResponse({"status": False, "message": "All fields are required"}, status=400)

        try:
            activity = RedcrossActivities(title=title, description=description, image=image)
            activity.save()
            return JsonResponse({"status": True, "message": "Activity added successfully"}, status=201)
        except Exception as e:
            print("Error saving activity:", str(e))
            return JsonResponse({"status": False, "message": "Error saving activity"}, status=500)

    return JsonResponse({"status": False, "message": "Invalid request method"}, status=405)




@csrf_exempt
def admin_delete_activity(request, id):
    if request.method == "DELETE":
        activity = get_object_or_404(RedcrossActivities, id=id)
        activity.delete()
        return JsonResponse({"status": True, "message": "Activity deleted successfully"}, status=200)
    
    return JsonResponse({"status": False, "message": "Activity delete failed"}, status=400)


@csrf_exempt
def admin_edit_activities(request, id):
    activity = get_object_or_404(RedcrossActivities, id=id)
    print(f"Received request for ID: {id}") 
    if request.method == "GET":
        return JsonResponse({
            "id": activity.id,
            "title": activity.title,
            "description": activity.description,
            "redcross_activities_image": activity.redcross_activities_image.url if activity.redcross_activities_image else None
        })

    elif request.method == "POST":
        data = request.POST
        files = request.FILES
        title = data.get("title")
        description = data.get("description")
        image = files.get("redcross_activities_image")

        updated = False

        if title and title != activity.title:
            activity.title = title
            updated = True

        if description and description != activity.description:
            activity.description = description
            updated = True

        if image:
            if activity.redcross_activities_image:
                default_storage.delete(activity.redcross_activities_image.path)
            activity.redcross_activities_image = image
            updated = True

        if updated:
            activity.save()
            return JsonResponse({"message": "✅ Activity updated successfully!", "updated": True})

        return JsonResponse({"message": "⚠️ No changes made", "updated": False})
    return JsonResponse({"error": "Invalid request method"}, status=400)
    



@csrf_exempt  # Temporary fix for 403 Forbidden issue
def admin_deleter_fellowship(request, id):
    if request.method == "DELETE":
        fellowship = get_object_or_404(Fellowership, id=id)
        fellowship.delete()
        return JsonResponse({"status": True, "message": "Fellowship deleted successfully"})
    
    return JsonResponse({"status": False, "message": "Invalid request method"}, status=400)



@csrf_exempt
def admin_edit_fellowship(request, id):
    fellowship = get_object_or_404(Fellowership, id=id)

    if request.method == "GET":
        return JsonResponse({
            "id": fellowship.id,
            "title": fellowship.title,
            "description": fellowship.description,
            "fellowership_image": fellowship.fellowership_image.url if fellowship.fellowership_image else None
        })

    elif request.method == "POST":  # ✅ Now handling POST instead of PUT
        print("📥 Incoming POST Request")
        data = request.POST
        files = request.FILES

        title = data.get("title")
        description = data.get("description")
        image = files.get("fellowership_image")

        updated = False

        if title and title != fellowship.title:
            fellowship.title = title
            updated = True
        if description and description != fellowship.description:
            fellowship.description = description
            updated = True
        if image:
            if fellowship.fellowership_image:
                default_storage.delete(fellowship.fellowership_image.path)  # Delete old image
            fellowship.fellowership_image = image
            updated = True

        if updated:
            fellowship.save()
            print("✅ Fellowship updated successfully in DB")
            return JsonResponse({"message": "✅ Fellowship updated successfully!", "updated": True,"redirect_url":"/admin/myfelowership"})
        else:
            print("⚠️ No changes detected")
            return JsonResponse({"message": "⚠️ No changes made", "updated": False})

    return JsonResponse({"error": "Invalid request method"}, status=400)



def admin_family(request):
    family = Family.objects.all()


    data = []
    for fam in family:
        data.append({
            "id": fam.id,  
            "name": fam.name,
            "father": fam.father.username if fam.father else "Not Assigned",
            "mother": fam.mother.username if fam.mother else "Not Assigned",
            "number_of_members": fam.family.count(),
        })
                
    return JsonResponse(data, safe=False)

def admin_info(request):
    family_count = Family.objects.count()  
    member_count = Members.objects.count()  
    activities_count = RedcrossActivities.objects.count() 
    fellowership_count=Fellowership.objects.count()
    announcement_count=Announcement.objects.count()

     

    return JsonResponse({
        "family": family_count,
        "member": member_count,
        "activities": activities_count,
        "Fellowership":fellowership_count,
        "announcement_count":announcement_count
    })



def All_fellowships(request):
    fellowships = Fellowership.objects.all().order_by('-created_at')
    data = []
    for fellow in fellowships:
        image_url = None
        if fellow. fellowership_image:
            try:
                image_url = request.build_absolute_uri(fellow. fellowership_image.url)
            except Exception as e:
                print("Error:", str(e))
        data.append({
            "title": fellow.title,
            "description": fellow.description,
            "fellowship_image": image_url,
            "created_at":fellow.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        })
    return JsonResponse(data, safe=False)


def All_activities(request):
    all_activities = RedcrossActivities.objects.all().order_by('-created_at')
    data = []
    for activity in all_activities:
        image_url = None
        if activity.redcross_activities_image:
            try:
                image_url = request.build_absolute_uri(activity.redcross_activities_image.url)
            except Exception as e:
                print("Error:", str(e))
        data.append({
            "title": activity.title,
            "description": activity.description,
            "redcross_activities_image": image_url,
            "created_at":activity.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        })
    return JsonResponse(data, safe=False)


def announcement_list(request):
    anounce = Announcement.objects.all().order_by("-created_at")[:6]
    data = []
    for announcement in anounce:
        data.append({
            "title": announcement.title,
            "text": announcement.text,
            "created": announcement.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        })
    return JsonResponse(data, safe=False)



@csrf_protect  # Protect view with CSRF validation
def Admin_announcement(request):
    # Generate CSRF token to send in the response
    csrf_token = get_token(request)

    # Fetch announcements
    announcements = list(Announcement.objects.values("id", "title", "text", "created_at"))

    # Prepare JSON response with announcements
    response = JsonResponse({"announcements": announcements})
    
    # Set CSRF token as a cookie for frontend
    response.set_cookie("csrftoken", csrf_token, httponly=False, samesite='Lax')
    
    return response



@csrf_exempt
def admin_add_announcement(request):
    if request.method == "POST":
        title = request.POST.get("title")
        text = request.POST.get("text")
        csrf_token = request.META.get('HTTP_X_CSRFTOKEN')
        print("CSRF Token in request:", csrf_token)
        if not title or not text:
            return JsonResponse({"status": False, "message": "All fields are required"}, status=400)

        announcement = Announcement(title=title, text=text)
        announcement.save()
    return JsonResponse({"status": True, "message": "Announcement added successfully"}, status=201)

@csrf_exempt
def admin_delete_announcement(request, id):
    if request.method == "DELETE":
        announcement = get_object_or_404(Announcement, id=id)
        announcement.delete()
        return JsonResponse({"status": True, "message": "Announcement deleted successfully"})
    return JsonResponse({"status": False, "message": "Invalid request method"}, status=400)

@csrf_exempt
def admin_edit_announcement(request, id):
    announcement = get_object_or_404(Announcement, id=id)
    if request.method == "GET":
        return JsonResponse({
            "id": announcement.id,
            "title": announcement.title,
            "text": announcement.text,

        })
    elif request.method == "POST":
        title = request.POST.get("title")
        text = request.POST.get("description")  
        
        updated = False
        if title and title != announcement.title:
            announcement.title = title
            updated = True
        if text and text != announcement.text:
            announcement.text = text
            updated = True
        
        if updated:
            announcement.save()
            return JsonResponse({"message": "Announcement updated successfully!", "updated": True,"redirect_url":"/admin/announcement/"})
        else:
            return JsonResponse({"message": "No changes made", "updated": False})
    
    return JsonResponse({"error": "Invalid request method"}, status=400)

def first_aid_course(request):
    firstaid=FirstAidCourse.objects.all()
    data=[]
    for fa in firstaid:
     data.append({
            "id":fa.id,
            "title":fa.title,
            "description":fa.description,
              "first_video": request.build_absolute_uri(fa.first_id_video.url) if fa.first_id_video else None,
              "first_image":request.build_absolute_uri(fa.first_image.url) if fa.first_image else None,
            "created_at":fa.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        })
    return JsonResponse(data,safe=False)


def first_aid_course_details(request,id):
    firstaid = get_object_or_404(FirstAidCourse, id=id)
    
    data = {
          
        "title": firstaid.title,
        "instructor": {
            "id": firstaid.instructor.id,
            "name": firstaid.instructor.name,
            "email": firstaid.instructor.email,
            "phone": firstaid.instructor.phone,
            "instructor_image": request.build_absolute_uri(firstaid.instructor.instructor_image.url) if firstaid.instructor.instructor_image else None
        },
        "description": firstaid.description,
        "first_video": request.build_absolute_uri(firstaid.first_id_video.url) if firstaid.first_id_video else None,
        "first_image": request.build_absolute_uri(firstaid.first_image.url) if firstaid.first_image else None,
        "created_at": firstaid.created_at.strftime("%Y-%m-%d %H:%M:%S"),
    }
    return JsonResponse(data, safe=False)

def instructor_info(request):
    instuctuct=Instructors.objects.all()
    data=[]
    for ins in instuctuct:
        data.append({
            "id":ins.id,
            "name":ins.name,
            "email":ins.email,
            "phone":ins.phone,
            "instructor_image":request.build_absolute_uri(ins.instructor_image.url) if ins.instructor_image else None,
        })
    return JsonResponse(data,safe=False)


def admin_courses(request):
    coureses=FirstAidCourse.objects.all()
    data=[]
    for course in coureses:
        data.append({
            "title":course.title,
            "instructor":{
            "name":course.instructor.name,
            "email":course.instructor.email,
            "phone":course.instructor.phone,
            "instructor_image":request.build_absolute_uri(course.instructor.instructor_image.url) if course.instructor.instructor_image else None
            },
            "description":course.description,
            "firs_video":request.build_absolute_uri(course.first_id_video.url) if course.first_id_video else None,
            "first_image":request.build_absolute_uri(course.first_image.url) if course.first_image else None
        })
    return JsonResponse(data,safe=False)


  

def user_profile(request):
    # Check if the user is authenticated
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User is not authenticated"}, status=401)

    # Get the user's profile information
    user = request.user
    profile_info = User.objects.filter(username=user.username).first()

    
    print("Logged user in view:", user.username)

    if not profile_info:
        return JsonResponse({"error": "User not found"}, status=404)

  
    return JsonResponse({
        "username": profile_info.username,
        "email": profile_info.email,
        "is_superuser": profile_info.is_superuser,
        "is_staff": profile_info.is_staff,
    })

 


def redcross_leader(request):
    leader=RedcrossLeader.objects.all()
    data=[]
    for le in leader:
        data.append({
            "first_name":le.first_name,
            "last_name":le.last_name,
            "start_date":le.start_year,
            "end_year":le.end_year,
            "leader_image":request.build_absolute_uri(le.leader_image.url) if le.leader_image else None


        })
    return JsonResponse(data, safe=False)



logger = logging.getLogger(__name__)

@csrf_exempt
def messages_info(request):
    if request.method == "POST":
        logger.info(f"CSRF Token: {request.META.get('HTTP_X_CSRFTOKEN')}")
        logger.info(f"POST Data: {request.POST}")
        name = request.POST.get("name")
        email = request.POST.get("email")
        description = request.POST.get("description")
        if not name or not email or not description:
            return JsonResponse({"status": False, "message": "All fields are required"}, status=400)
        message = Messages(name=name, email=email, description=description)
        message.save()
        return JsonResponse({"status": True, "message": "Message submitted successfully"})
    return JsonResponse({"status": False, "message": "Invalid request method"}, status=405)
    
def admin_messages(request):
    message=Messages.objects.all().order_by('created_at')
    data=[]
    for mes in message:
        data.append({
            "id":mes.id,
            "name":mes.name,
            "email":mes.email,
            "description":mes.description,
            "created_at":mes.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        })    
    return JsonResponse(data,safe=False)
    






@csrf_exempt
def update_message_status(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            ids = data.get('ids', [])
            action = data.get('action', '')

            if not ids:
                return JsonResponse({"status": False, "message": "No messages selected"}, status=400)

            messages = Messages.objects.filter(id__in=ids)

            if not messages.exists():
                return JsonResponse({"status": False, "message": "Messages not found"}, status=404)

            for message in messages:
                if action == "read":
                    message.status = "archived"  # Move to archive when marked as read
                    message.save()
                elif action == "unread":
                    message.status = "unread"
                    message.save()
                elif action == "archive":
                    message.status = "archived"
                    message.save()
                elif action == "delete":
                    message.delete()
                else:
                    return JsonResponse({"status": False, "message": "Invalid action"}, status=400)

            return JsonResponse(
                {"status": True, "message": f"Messages marked as {action}"} if action != "delete" 
                else {"status": True, "message": "Messages deleted successfully"}
            )

        except Exception as e:
            return JsonResponse({"status": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"status": False, "message": "Invalid request method"}, status=405)
    


@csrf_exempt
def get_archived_messages(request):
    if request.method == 'GET':
        try:
            archived_messages = Messages.objects.filter(status="archived")
            messages_data = [
                {
                    "id": message.id,
                    "name": message.name,
                    "email": message.email,
                    "description": message.description,
                    "created_at": message.created_at,
                    "status": message.status,
                }
                for message in archived_messages
            ]
            return JsonResponse({"status": True, "messages": messages_data})
        except Exception as e:
            return JsonResponse({"status": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"status": False, "message": "Invalid request method"}, status=405)
    

@csrf_exempt
def get_all_messages(request):
    if request.method == 'GET':
        try:
            all_messages = Messages.objects.all()
            messages_data = [
                {
                    "id": message.id,
                    "name": message.name,
                    "email": message.email,
                    "description": message.description,
                    "created_at": message.created_at,
                    "status": message.status,
                }
                for message in all_messages
            ]
            return JsonResponse({"status": True, "messages": messages_data})
        except Exception as e:
            return JsonResponse({"status": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"status": False, "message": "Invalid request method"}, status=405) 



def all_messages(request):
    message=Messages.objects.all().count()
    return JsonResponse(message,safe=False)



def subscribe_letter(request):
    all_letter=SubscribeNewslatter.objects.all().count()
    return JsonResponse(all_letter,safe=False)

def subscribe_newsletter(request):
     all_email=SubscribeNewslatter.objects.all()
     data=[]
     for em in all_email:
         data.append({
             "id":em.id,
             "email":em. email,
             
         })
     return JsonResponse(data,safe=False)
@csrf_exempt     
def add_email_toseubscribenewsletter(request):
    if request.method =="POST":
        email=request.POST.get("email")
        if not email:
            return JsonResponse({"status": False, "message": "Email field is required"}, status=400)
        subscribe=SubscribeNewslatter(email=email)
        subscribe.save()
        return JsonResponse({"status": True, "message": "Email Subscribed successfully"}, status=201)
    else:
        return JsonResponse({"status": False, "message": "Invalid request method"}, status=405)
    


def delete_user_session(request):
    request.session.flush()  # Logs out the user and clears the session
    return HttpResponse("Session deleted")    
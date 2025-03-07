from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (  LoginView, logout_view, user_list,family_list,announcement_list,
                    members_list,felloweship_list,redcrossactivities_list,current_user
                    ,first_id_course_list,Createuserview)

urlpatterns = [
    path('users/', user_list, name='user_list'),
    path('families/', family_list, name='family_list'),
     path('families/<int:name>/', family_list, name='family_detail'),
    path("members/",members_list,name="member"),
    path('announcements/', announcement_list, name='announcement_list'),
    path('felloweship/', felloweship_list, name='felloweship_list'),
    path('redcrossactivities/', redcrossactivities_list, name='redcrossactivities_list'),
    path('first_ai_course_list/',first_id_course_list,name='first_ai_course_list'),
    path('register/',Createuserview.as_view(),name='register'),
        path("login/", LoginView.as_view(), name="login"),
        path("current_user/", current_user, name="current_user"),
        path('logout/', logout_view, name='logout'),
    path('token/',TokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('token/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    ]
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (  ChangeProfilePicture, LoginView,ResetPasswordView,Admin_all_generalinformation, add_user_info,  download_single_user_info, logout_view, user_list,family_list,announcement_list,
                    members_list,felloweship_list,redcrossactivities_list,current_user
                    ,first_id_course_list,Createuserview,GeneralInformation,ProofOfRegistrationView,EditGeneralInformation)

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
    path('add_user_info/',add_user_info,name='add_user_info'),
    path('general_information/',GeneralInformation.as_view(),name='general_information'),
    path('proof_of_registration/<int:user_id>/',ProofOfRegistrationView.as_view(),name='proof_of_registration'),
    path('edit_general_information/<int:user_id>/',EditGeneralInformation.as_view(),name='edit_general_information'),
    path('reset_password/',ResetPasswordView.as_view(),name='reset_password'),
    path('admin_all_generalinformation/',Admin_all_generalinformation.as_view(),name='admin_all_generalinformation'),
      path('download_single_user_info/<int:user_id>/', download_single_user_info, name='download_all_users_info'),
      path("change_profile_picture/", ChangeProfilePicture.as_view(), name="change_profile_picture")
    ]
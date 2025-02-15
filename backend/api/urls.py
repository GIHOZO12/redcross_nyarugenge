from django.urls import path
from .views import (user_list,family_list,announcement_list,
                    members_list,felloweship_list,redcrossactivities_list
                    ,first_id_course_list,CustomTokenObtainPairView,CustomRefreshToken,logout_view,is_auntenticated)

urlpatterns = [
    path('users/', user_list, name='user_list'),
    path('families/', family_list, name='family_list'),
     path('families/<int:name>/', family_list, name='family_detail'),
    path("members/",members_list,name="member"),
    path('announcements/', announcement_list, name='announcement_list'),
    path('felloweship/', felloweship_list, name='felloweship_list'),
    path('redcrossactivities/', redcrossactivities_list, name='redcrossactivities_list'),
    path('first_ai_course_list/',first_id_course_list,name='first_ai_course_list'),

    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CustomRefreshToken.as_view(), name="token_refresh"),
    path("logout_view/", logout_view, name="logout"),
    path("is_authenticated/", is_auntenticated, name="is_authenticated"),


    
    ]
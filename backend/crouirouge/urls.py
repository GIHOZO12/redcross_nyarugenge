from django.urls import path
from . import views


urlpatterns = [
    path('anounce',views.anouncement_list,name='announcement'),
    path('login_info/',views.login_info,name='login_info'),
    path('check_auth/',views.check_auth,name='check_auth'),
    path('register/',views.register,name='register'),
    path('logout/',views.logout_info,name='logout'),
    path("user_get_token/",views.user_get_token,name="user_get_token"),
    path("user_profile/", views.user_profile, name="user_profile"),
    path("family_list/<str:name>/", views.get_family_details, name="family_list"),
    path('family_members/<str:name>/' , views.family_members, name='family_members'),
    path("get-csrf-token/", views.get_csrf_token, name="get_csrf_token"),
    path("get-csrf-token-activity/", views.get_csrf_token_activity, name="get_csrf_token_activity"),
    path('family_activities/<str:name>/', views.family_activities, name='family_activities'),
    path("update_activity/<int:id>/", views.update_activity, name="update_activity"),
    path("family_delete_activity/<int:id>/",views.family_delete_activity,name="family_delete_activity"),
    path("edit_activity/<int:id>/", views.admin_edit_activities, name="edit_activities"), 
    path('create_activity/', views.create_activity, name='create_activity'),
     path('latest_fellowership/',views.latest_fellowership,name='latest_fellowership'),
     path('latest_redcross_activities/',views.latest_redcross_activities,name='latest_redcross_activities'),
     path('users_info/',views.users_info,name='users_info'),
     path('admin_activities/',views.admin_activities,name='admin_activities'),
     path("admin/delete_activity/<int:id>/",views.admin_delete_activity,name="delete-activity"),
     path('admin_fellowships/',views.admin_fellowships,name='admin_fellowships'),
     path("admin_deleter_fellowship/<int:id>/", views.admin_deleter_fellowship, name="admin_deleter_fellowship"),
     path("admin_edit_fellowship/<int:id>/", views.admin_edit_fellowship, name="admin_edit_fellowship"),
     path('admin_family/', views.admin_family, name='admin_family'),
     path('add_fellowship/', views.add_fellowship, name='add_fellowship'),
    path('admin/addactivities/', views.admin_add_activity, name='admin_add_activity'),
     path("admin_info/", views.admin_info, name="admin_info"),
     path("all_fellowships/", views. All_fellowships, name="all_fellowships"),
     path("All_activities/", views.All_activities, name="All_activities"),
     path("announcement_list/", views.announcement_list, name="announcement_list"),
     path("admin_announcement/", views.Admin_announcement, name="admin_announcement"),
     path("admin_add_announcement/", views.admin_add_announcement, name="admin_add_announcement"),
     path('edit_announcement/<int:id>/', views.admin_edit_announcement, name='admin_edit_announcement'),
     path("admin_delete_announcement/<int:id>/", views.admin_delete_announcement, name="admin_delete_announcement"),
     path("first-aid_course/",views.first_aid_course,name="first_aid_course"),
     path('first-aid_course/<int:id>/', views.first_aid_course_details, name='first_aid_course_details'),
     path("instructor_info/", views.instructor_info, name="instructor_info"),
     path("admin_courses/", views.admin_courses, name="admin_courses")  ,
     path("leaders",views.redcross_leader,name="leaders"),
     path("messages_info/", views.messages_info, name="messages_info"),
     path("admin_messages/", views.admin_messages, name="admin_messages"),
     path("update_message_status/", views.update_message_status, name="update_message_status"),
     path("get_archived_messages/", views.get_archived_messages, name="get_archived_messages"),
     path("get_all_messages/", views.get_all_messages, name="get_all_messages"),
     path("all_messages/",views.all_messages,name="all_messages"),
     path("all_subscribes/",views.subscribe_newsletter,name="subscribe_newsletter"),
     path("add_email_toseubscribenewsletter/",views.add_email_toseubscribenewsletter,name="add_email_toseubscribenewsletter"),
   

    ]
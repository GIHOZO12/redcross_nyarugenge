from django.contrib import admin
from django.conf import settings
from .models import (
    RequestMembership, User, Family, Announcement, Members, FamilyActivities, 
    Fellowership, RedcrossActivities, FirstAidCourse, 
    Instructors, RedcrossLeader,Messages,
    SubscribeNewslatter,Address,Generalinformation,BloodDonation

)



admin.site.site_url = settings.SITE_URL
       
 

@admin.register(RequestMembership)
class RequestMembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'user__email', 'message')
    actions = ['approve_requests', 'reject_requests']

    def approve_requests(self, request, queryset):
        for req in queryset:
            req.status = 'approved'
            req.save()
            # Optionally update user role here
            req.user.role = 'Member'
            req.user.save()
        self.message_user(request, f"{queryset.count()} requests approved.")

    def reject_requests(self, request, queryset):
        queryset.update(status='rejected')
        self.message_user(request, f"{queryset.count()} requests rejected.")

    approve_requests.short_description = "Approve selected requests"
    reject_requests.short_description = "Reject selected requests"

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["username", "email", "role", "profile_image"]
    search_fields = ["username", "email", "role"]
    list_filter = ["role"]
    list_per_page = 10

@admin.register(Family)
class FamilyAdmin(admin.ModelAdmin):
    list_display = ["name", "father", "mother"]
    list_display_links = ["name"]  # Fix
    search_fields = ["name", "father", "mother"]
    list_filter = ["name"]
    list_editable = ["father", "mother"]
    list_per_page = 10

@admin.register(RedcrossLeader)
class RedcrossLeaderAdmin(admin.ModelAdmin):
    list_display = ["first_name", "last_name", "leader_image", "start_year", "end_year"]
    list_display_links = ["first_name"]  
    search_fields = ["first_name", "last_name"]
    list_editable = ["last_name", "leader_image", "start_year", "end_year"]
    list_per_page = 10

@admin.register(Fellowership)
class FellowershipAdmin(admin.ModelAdmin):
    list_display = ["title", "description", "fellowership_image", "created_at"]
    list_display_links = ["title"]  
    list_filter = ["created_at"]
    search_fields = ["title", "description"]
    list_editable = ["description", "fellowership_image"]
    list_per_page = 10

@admin.register(RedcrossActivities)
class RedcrossActivitiesAdmin(admin.ModelAdmin):
    list_display = ["title", "description", "redcross_activities_image", "created_at"]
    list_display_links = ["title"]  
    list_filter = ["created_at"]
    search_fields = ["title", "description"]
    list_editable = ["description", "redcross_activities_image"]
    list_per_page = 10

@admin.register(FamilyActivities)
class FamilyActivitiesAdmin(admin.ModelAdmin):
    list_display = ["title", "text", "created", "activityImage"]
    list_display_links = ["title"]  
    list_filter = ["created"]
    search_fields = ["title", "text"]
    list_editable = ["text", "activityImage"]
    list_per_page = 10

@admin.register(FirstAidCourse)
class FirstAidCourseAdmin(admin.ModelAdmin):
    list_display = ["title", "description", "first_id_video", "first_image", "created_at"]
    list_display_links = ["title"]  
    list_filter = ["created_at"]
    search_fields = ["title", "description"]
    list_editable = ["description", "first_id_video", "first_image"]
    list_per_page = 10

@admin.register(Instructors)
class InstructorsAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "phone", "instructor_image"]
    list_display_links = ["name"]  
    search_fields = ["name", "email", "phone"]
    list_editable = ["email", "phone", "instructor_image"]
    list_per_page = 10

@admin.register(Members)
class MembersAdmin(admin.ModelAdmin):
    list_display = ["first_name", "last_name", "email", "family"]
    list_display_links = ["first_name"]  
    search_fields = ["first_name", "last_name", "email"]
    list_editable = ["last_name", "email", "family"]
    list_per_page = 10

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ["title", "text", "created_at"]
    list_display_links = ["title"]  # Fix
    list_filter = ["created_at"]
    search_fields = ["title", "text"]
    list_editable = ["text"]
    list_per_page = 10


@admin.register(Messages)

class MessagesAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "description", "created_at"]
    list_display_links = ["name"]  # Fix
    list_filter = ["created_at"]
    search_fields = ["name", "email", "description"]
    list_editable = ["email","description"]


@admin.register(SubscribeNewslatter)

class SubscribeNewslatterAdmin(admin.ModelAdmin):
    list_display = ["email", "created_at"]
    list_display_links = ["email"]  # Fix
    list_filter = ["created_at"]
    search_fields = ["email"]
    list_per_page = 10


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ["user", "province", "district", "sector", "cell", "village"]
    list_display_links = ["user"]  # Fix
    search_fields = ["user", "province", "district", "sector", "cell", "village"]
    list_per_page = 10

@admin.register(Generalinformation)
class GeneralinformationAdmin(admin.ModelAdmin):
    list_display = ["user", "nationalId", "gender", "department", "address", "blood_donated"]
    list_display_links = ["user"]  # Fix
    search_fields = ["user", "nationalId", "gender", "department"]
    list_per_page = 10
    
@admin.register(BloodDonation)
class BloodDonationAdmin(admin.ModelAdmin):
    list_display = ["user", "donated", "donated_times"]


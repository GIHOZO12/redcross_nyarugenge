from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

role=[
    ('Father','Father'),
    ('Mother','Mother'),
    ('Member','Member'),
    ('President','President'),
    ('Vice President','Vice President'),
    ('admin','admin'),
    ("child","child")
]

class User(AbstractUser):
    role=models.CharField(max_length=120,choices=role,default='child')
    profile_image=models.ImageField(upload_to='profile_images/', blank=True, null=True)
    first_name=models.CharField(max_length=120)
    last_name=models.CharField(max_length=120)
    username=models.CharField(max_length=120,unique=True)
    email=models.EmailField(max_length=120,unique=True)
    is_active=models.BooleanField(default=True)
    is_staff=models.BooleanField(default=False)
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['username']
    class Meta:
         verbose_name="User"
         verbose_name_plural = "Users"
    def __str__(self):
        return self.username
    

from django.contrib.auth import get_user_model

User = get_user_model()

class RequestMembership(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='membership_requests')
    message = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Membership request from {self.user.username} - {self.status}"

    class Meta:
        ordering = ['-created_at']

         
blood_donated=[
        ('yes','yes'),
        ('no','no')
]

gender_choices=[
        ('Male','Male'),
        ('Female','Female'),
        ('Other','Other')
     ]
class Address(models.Model):
     user=models.OneToOneField(User,on_delete=models.CASCADE,related_name="address")
     province=models.CharField(max_length=120)
     district=models.CharField(max_length=120)
     sector=models.CharField(max_length=120)
     cell=models.CharField(max_length=120)
     village=models.CharField(max_length=120)
class BloodDonation(models.Model):
     user=models.OneToOneField(User,on_delete=models.CASCADE,related_name="blood_donation")
     donated=models.CharField(max_length=120,choices=blood_donated)
     donated_times=models.IntegerField()


class Generalinformation(models.Model):
     user=models.OneToOneField(User,on_delete=models.CASCADE,related_name="general_information")
     nationalId=models.IntegerField(unique=True)
     gender=models.CharField(max_length=120,choices=gender_choices)
     department=models.CharField(max_length=120)
     address=models.OneToOneField(Address,on_delete=models.CASCADE,related_name="general_information")
     blood_donated=models.OneToOneField(BloodDonation,on_delete=models.CASCADE,related_name="general_information")
     class Meta:
          verbose_name="General Information"
          verbose_name_plural = "General Informations"
          def __str__(self):
               return self.user.username

      


class Family(models.Model):
    name = models.CharField(max_length=120)
    father=models.OneToOneField(User,on_delete=models.CASCADE,related_name="father",null=True,blank=True,limit_choices_to={'role': 'Father'})
    mother=models.OneToOneField(User,on_delete=models.CASCADE,related_name="mother",null=True,blank=True,limit_choices_to={'role': 'Mother'})
    class Meta:
         verbose_name="Family"
         verbose_name_plural = "Families"
    def __str__(self):
        return self.name
class FamilyActivities(models.Model):
    family=models.ForeignKey(Family,on_delete=models.CASCADE,related_name="family_activities")
    title = models.CharField(max_length=120)
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    activityImage = models.ImageField(upload_to='activity_images/', blank=True, null=True)
    class Meta:
         verbose_name="Family Activity"
         verbose_name_plural = "Family Activities"
    def __str__(self):
        return self.title    
class Members(models.Model):
    family=models.ForeignKey(Family,on_delete=models.CASCADE,related_name="family")
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="user",null=True,blank=True,limit_choices_to={'role': 'child'})
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    email = models.EmailField(max_length=120) 
    class Meta:
         verbose_name="Member"
         verbose_name_plural = "Members"
class Announcement(models.Model):
    title = models.CharField(max_length=120)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)  
    class Meta:
         verbose_name="Announcement"
         verbose_name_plural = "Announcements"

    def __str__(self):
        return self.title
    

class Fellowership(models.Model):
        title=models.CharField(max_length=120)
        description=models.TextField()
        fellowership_image=models.ImageField(upload_to='fellowership_images/', blank=True, null=True)
        created_at = models.DateTimeField(auto_now_add=True)  
        class Meta:
             verbose_name="Fellowship"
             verbose_name_plural = "Fellowships"
            

        def __str__(self):
            return self.title
class RedcrossActivities(models.Model):
        title=models.CharField(max_length=120)
        description=models.TextField()
        redcross_activities_image=models.ImageField(upload_to='redcross_activities_images/', blank=True, null=True)
        created_at = models.DateTimeField(auto_now_add=True)  
        class Meta:
             verbose_name="Redcross Activity"
             verbose_name_plural = "Redcross Activities"
        def __str__(self):
             return self.title
        
# firstaidcourses
class Instructors(models.Model):
     name=models.CharField(max_length=120)
     email=models.EmailField(max_length=120)
     phone=models.CharField(max_length=120)
     instructor_image=models.ImageField(upload_to='instructor_images/', blank=True, null=True)
     class Meta:
          verbose_name="Instructor"
          verbose_name_plural = "Instructors"
     def __str__(self):
          return self.name
 
class FirstAidCourse(models.Model):
    instructor = models.ForeignKey(
        Instructors, on_delete=models.CASCADE, related_name="courses", null=True, blank=True  # ✅ Allow null values
    )
    title = models.CharField(max_length=120)
    description = models.TextField()
    first_id_video = models.FileField(upload_to="firstaid_videos/", blank=True, null=True)
    first_image = models.ImageField(upload_to="firstaid_images/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
         verbose_name="First Aid Course"
         verbose_name_plural = "First Aid Courses"

    def __str__(self):
        return self.title
    


class RedcrossLeader(models.Model):
     first_name=models.CharField(max_length=200)
     last_name=models.CharField(max_length=200)
     leader_image=models.ImageField(upload_to="leaders_image",blank=True,null=True)
     start_year=models.DateField()
     end_year=models.DateField()
     class Meta:
          verbose_name="Redcross Leader"
          verbose_name_plural = "Redcross Leaders"
     def __str__(self):
          return self.first_name
     
 

class Messages(models.Model):
     name=models.CharField(max_length=200)
     email=models.EmailField()
     description=models.TextField()
     created_at=models.DateTimeField(auto_now_add=True)
     status = models.CharField(max_length=20, default="unread")
    
     def __str__(self):
          return self.name     
     

class SubscribeNewslatter(models.Model):
     email=models.EmailField()
     created_at=models.DateTimeField(auto_now_add=True)
     is_active = models.BooleanField(default=True) 
     class Meta:
          verbose_name="Subscribe Newslatter"
          verbose_name_plural = "Subscribe Newslatters"
     def __str__(self):
               return self.email     







             



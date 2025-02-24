from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from crouirouge.models import User


class EmailBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            # Attempt to find the user by email
            user = User.objects.get(email=email)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None

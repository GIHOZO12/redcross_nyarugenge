from rest_framework_simplejwt.authentication import JWTAuthentication

from rest_framework.authentication import SessionAuthentication
 # type: ignore


class CookeisAuthenticatedJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        if not access_token:
            return None
        validate_token=self.get_validated_token(access_token)
        try:
            user=user.get_user(validate_token)
        except:
            return None
        return (user, validate_token)


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return
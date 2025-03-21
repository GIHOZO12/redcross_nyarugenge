"""
URL configuration for Umuryango project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include,re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
admin.site.site_header="RRC Nyarugenge C. Youth s"
admin.site.index_title="RRC Nyarugenge C. Youth s"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('api.urls')),
    path("",include("crouirouge.urls")),
    path('api-auth/',include('rest_framework.urls')),
]
if settings.DEBUG:
   urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# urlpatterns +=[re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]

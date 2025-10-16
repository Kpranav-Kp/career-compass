from django.urls import path
from .views import ResumeUploadView, home_view

urlpatterns = [
    path("",home_view,name='home'),
    path('upload/', ResumeUploadView.as_view(), name='resume-upload'),
]

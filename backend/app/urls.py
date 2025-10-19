from django.urls import path
from .views import HealthCheckView, ResumeSkillExtractionView
from .views import home

urlpatterns = [
    path('', home, name='home'),
    path('', HealthCheckView.as_view()),  # Health check
    path('api/extract-skills/', ResumeSkillExtractionView.as_view(), name='extract-skills'),
]

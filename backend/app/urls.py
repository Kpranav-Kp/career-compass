from django.urls import path
from .views import ResumeSkillExtractionView

urlpatterns = [
    path('', ResumeSkillExtractionView.as_view(), name='extract_skills'),
]

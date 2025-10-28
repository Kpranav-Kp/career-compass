from django.urls import path
from .views import (
    ResumeSkillExtractionView, 
    RegistrationView, 
    LoginView, 
    ForgotPasswordView, 
    ResetPasswordView,
    SkillRoadmapView,
    ProjectIdeasView,
    SkillMarketAnalysisView,
    SkillRecommendView,
)

urlpatterns = [
    path('extract-skills', ResumeSkillExtractionView.as_view(), name='extract_skills'),
    path('register', RegistrationView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('forgotPassword', ForgotPasswordView.as_view(), name='forgotPassword'),
    path('resetPassword', ResetPasswordView.as_view(), name='resetPassword'),
    path('skill-roadmap', SkillRoadmapView.as_view(), name='skill_roadmap'),
    path('skill-recommend', SkillRecommendView.as_view(), name='skill_recommend'),
    path('skill-projects', ProjectIdeasView.as_view(), name='skill_projects'),
    path('skill-market-analysis', SkillMarketAnalysisView.as_view(), name='skill_market_analysis'),
]
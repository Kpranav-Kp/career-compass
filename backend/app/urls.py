from django.urls import path
from .views import ResumeSkillExtractionView,RegistrationView, LoginView, ForgotPasswordView, ResetPasswordView

urlpatterns = [
    path('', ResumeSkillExtractionView.as_view(), name='extract_skills'),
    path("register", RegistrationView.as_view(), name="register"),
    path("login", LoginView.as_view(), name="login"),
    path("forgotPassword", ForgotPasswordView.as_view(), name="forgotPassword"),
    path("resetPassword", ResetPasswordView.as_view(), name="resetPassword"),
]
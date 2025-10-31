from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Token, Resume
from .serializers import UserSerializer, TokenSerializer, ResumeSerializer
from django.conf import settings
from datetime import datetime, timedelta
import hashlib
import uuid
from django.utils import timezone
import traceback
import json
import logging
from .utils.openrouter_service import generate_skill_roadmap, analyze_market_demand, recommend_skills, extract_skills_from_resume
from .utils.skill_extractor import extract_text_from_pdf_file

logger = logging.getLogger(__name__)
SALT = "8b4f6b2cc1868d75ef79e5cfb8779c11b6a374bf0fce05b485581bf4e1e25b96c8c2855015de8449"
URL = "http://localhost:3000"

class SkillRoadmapView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        skills = request.data.get('skills') or request.data.get('skill')
        if isinstance(skills, str):
            skills = [skills]
        if not skills or not isinstance(skills, list):
            return Response({"error": "Skill(s) is required"}, status=status.HTTP_400_BAD_REQUEST)

        skills_normalized = [str(s).strip().lower() for s in skills if s and str(s).strip()]
        if not skills_normalized:
            return Response({"error": "No valid skills provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            roadmap = generate_skill_roadmap(skills_normalized) or {}
            return Response(roadmap, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Failed to generate roadmap: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SkillMarketAnalysisView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        skills = request.data.get('skills') or request.data.get('skill')
        if isinstance(skills, str):
            skills = [skills]
        if not skills or not isinstance(skills, list):
            return Response({"error": "Skill(s) is required"}, status=status.HTTP_400_BAD_REQUEST)

        skills_normalized = [str(s).strip().lower() for s in skills if s and str(s).strip()]
        if not skills_normalized:
            return Response({"error": "No valid skills provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            analysis = analyze_market_demand(skills_normalized) or {}
            return Response(analysis, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Failed to analyze market demand: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SkillRecommendView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        skills = request.data.get('skills', [])
        role = request.data.get('role')
        if not isinstance(skills, list):
            return Response({"error": "skills must be a list"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            recs = recommend_skills(skills, role)
            existing = {s.strip().lower() for s in skills if s and isinstance(s, str)}
            filtered = [r for r in recs if isinstance(r, str) and r.strip().lower() not in existing]
            return Response({"recommended_skills": filtered}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Failed to generate recommendations: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def mail_template(content, button_url, button_text):
    return f"""<!DOCTYPE html>
            <html>
            <body style="text-align: center; font-family: "Verdana", serif; color: #000;">
                <div style="max-width: 600px; margin: 10px; background-color: #fafafa; padding: 25px; border-radius: 20px;">
                <p style="text-align: left;">{content}</p>
                <a href="{button_url}" target="_blank">
                    <button style="background-color: #444394; border: 0; width: 200px; height: 30px; border-radius: 6px; color: #fff;">{button_text}</button>
                </a>
                <p style="text-align: left;">
                    If you are unable to click the above button, copy paste the below URL into your address bar
                </p>
                <a href="{button_url}" target="_blank">
                    <p style="margin: 0px; text-align: left; font-size: 10px; text-decoration: none;">{button_url}</p>
                </a>
                </div>
            </body>
            </html>"""

class ResumeSkillExtractionView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        if 'file' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        file_obj = request.FILES['file']
        role = request.data.get('role', '').strip()

        try:
            resume_text = extract_text_from_pdf_file(file_obj)
            if not resume_text.strip():
                return Response(
                    {"error": "Could not extract text from PDF"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            extracted_skills = extract_skills_from_resume(resume_text)
            logger.info(f"OpenRouter extracted {len(extracted_skills)} skills")
            recommended_skills = []
            if role and extracted_skills:
                recommended_skills = recommend_skills(extracted_skills, role)
                logger.info(f"OpenRouter recommended {len(recommended_skills)} skills for role: {role}")
                if recommended_skills:
                    recommended_skills = recommended_skills[:8]

            if recommended_skills and extracted_skills:
                existing_lower = {s.strip().lower() for s in extracted_skills if s and s.strip()}
                filtered = []
                for s in recommended_skills:
                    if not s or not isinstance(s, str):
                        continue
                    if s.strip().lower() in existing_lower:
                        continue
                    if s.strip() not in filtered:
                        filtered.append(s.strip())
                recommended_skills = filtered

            try:
                file_obj.seek(0)
            except Exception:
                pass

            filename = getattr(file_obj, 'name', None)
            resume = Resume.objects.create(
                file_name=filename,
                role=role,
                extracted_skills=", ".join(extracted_skills),
                recommended_skills=", ".join(recommended_skills) if recommended_skills else None
            )
            serializer = ResumeSerializer(resume)
            
            extraction_issue = None
            if not extracted_skills:
                if not resume_text or not resume_text.strip():
                    extraction_issue = "bad_read"
                elif len(resume_text) > 50000:
                    extraction_issue = "input_too_long"
                else:
                    extraction_issue = "no_skills_found"

            return Response({
                "status": "success",
                "data": serializer.data,
                "extracted_skills": extracted_skills,
                "recommended_skills": recommended_skills,
                "extraction_issue": extraction_issue
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            tb = traceback.format_exc()
            logger.error(f"Resume skill extraction error: {tb}")
            return Response({
                "status": "error", 
                "message": str(e), 
                "traceback": tb
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        user_id = request.data["id"]
        token = request.data["token"]
        password = request.data["password"]

        token_obj = Token.objects.filter(
            user_id=user_id).order_by("-created_at")[0]
        if token_obj.expires_at < timezone.now():
            return Response(
                {
                    "success": False,
                    "message": "Password Reset Link has expired!",
                },
                status=status.HTTP_200_OK,
            )
        elif token_obj is None or token != token_obj.token or token_obj.is_used:
            return Response(
                {
                    "success": False,
                    "message": "Reset Password link is invalid!",
                },
                status=status.HTTP_200_OK,
            )
        else:
            token_obj.is_used = True
            hashed_password = make_password(password=password, salt=SALT)
            ret_code = User.objects.filter(
                id=user_id).update(password=hashed_password)
            if ret_code:
                token_obj.save()
                return Response(
                    {
                        "success": True,
                        "message": "Your password reset was successfully!",
                    },
                    status=status.HTTP_200_OK,
                )


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        email = request.data["email"]
        user = User.objects.get(email=email)
        created_at = timezone.now()
        expires_at = timezone.now() + timezone.timedelta(1)
        salt = uuid.uuid4().hex
        token = hashlib.sha512(
            (str(user.id) + user.password + created_at.isoformat() + salt).encode(
                "utf-8"
            )
        ).hexdigest()
        token_obj = {
            "token": token,
            "created_at": created_at,
            "expires_at": expires_at,
            "user_id": user.id,
        }
        serializer = TokenSerializer(data=token_obj)
        if serializer.is_valid():
            serializer.save()
            subject = "Forgot Password Link"
            content = mail_template(
                "We have received a request to reset your password. Please reset your password using the link below.",
                f"{URL}/resetPassword?id={user.id}&token={token}",
                "Reset Password",
            )
            send_mail(
                subject=subject,
                message=content,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                html_message=content,
            )
            return Response(
                {
                    "success": True,
                    "message": "A password reset link has been sent to your email.",
                },
                status=status.HTTP_200_OK,
            )
        else:
            error_msg = ""
            for key in serializer.errors:
                error_msg += serializer.errors[key][0]
            return Response(
                {
                    "success": False,
                    "message": error_msg,
                },
                status=status.HTTP_200_OK,
            )


class RegistrationView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        request.data["password"] = make_password(
            password=request.data["password"], salt=SALT
        )
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": True, "message": "You are now registered on our website!"},
                status=status.HTTP_200_OK,
            )
        else:
            error_msg = ""
            for key in serializer.errors:
                error_msg += serializer.errors[key][0]
            return Response(
                {"success": False, "message": error_msg},
                status=status.HTTP_200_OK,
            )


class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        email = request.data["email"]
        password = request.data["password"]
        hashed_password = make_password(password=password, salt=SALT)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"success": False, "message": "Invalid Login Credentials!"}, status=status.HTTP_200_OK)

        if user is None or user.password != hashed_password:
            return Response(
                {
                    "success": False,
                    "message": "Invalid Login Credentials!",
                },
                status=status.HTTP_200_OK,
            )
        else:
            # create JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "success": True,
                    "message": "You are now logged in!",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK,
            )

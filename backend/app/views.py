from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .utils.skill_extractor import extract_skills_from_resume

def home(request):
    return JsonResponse({
        "message": "Welcome to Career Compass Backend API",
        "status": "success"
    })

class HealthCheckView(APIView):
    def get(self, request):
        return JsonResponse({"message": "Career Compass API is running!"})


class ResumeSkillExtractionView(APIView):
    """
    API endpoint to test resume upload and extract skills.
    Optional: include `job_role` in form-data to enhance skills using Phi model
    """
    def post(self, request, *args, **kwargs):
        try:
            # Validate file input
            if 'file' not in request.FILES:
                return Response({"error": "No resume file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

            file = request.FILES['file']
            job_role = request.data.get('job_role', "")

            # Extract skills using your utility function
            extracted_skills = extract_skills_from_resume(file, job_role=job_role)

            return Response({
                "status": "success",
                "job_role": job_role,
                "extracted_skills": extracted_skills
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

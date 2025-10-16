from rest_framework.views import APIView
from rest_framework.response import Response
from .utils.skill_extractor import extract_skills_from_resume
from .models import Resume
from .serializers import ResumeSerializer
from django.http import JsonResponse

def home_view(request):
    return JsonResponse({"message": "Career Compass API running!"})

class ResumeUploadView(APIView):
    def post(self, request, *args, **kwargs):
        file = request.FILES['file']
        role = request.data.get('role')

        # Call your extractor
        extracted_skills = extract_skills_from_resume(file)

        # Save to DB
        resume = Resume.objects.create(
            file=file,
            extracted_skills=extracted_skills,
        )

        serializer = ResumeSerializer(resume)
        return Response(serializer.data)

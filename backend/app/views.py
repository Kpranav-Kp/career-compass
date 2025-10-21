from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ResumeSerializer
from .models import Resume
from .utils.skill_extractor import extract_text_from_pdf_file
from .utils.generator import (
    call_mistral_chat,
    extract_skills_prompt,
    recommend_skills_prompt
)

class ResumeSkillExtractionView(APIView):
    def post(self, request, *args, **kwargs):
        if 'file' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        file_obj = request.FILES['file']
        role = request.data.get('role', '').strip()

        try:
            # 1) extract text
            resume_text = extract_text_from_pdf_file(file_obj)
            if not resume_text.strip():
                return Response({"error": "Could not extract text from PDF"}, status=status.HTTP_400_BAD_REQUEST)

            # 2) call mistral to extract skills
            prompt_extract = extract_skills_prompt(resume_text)
            extracted_text = call_mistral_chat(prompt_extract, max_tokens=250, temperature=0.0)
            # normalize output to list
            extracted_skills = [s.strip() for s in extracted_text.split(",") if s.strip()]

            # 3) call mistral to recommend additional skills (if role provided)
            recommended_skills = []
            if role:
                prompt_rec = recommend_skills_prompt(", ".join(extracted_skills), role)
                rec_text = call_mistral_chat(prompt_rec, max_tokens=200, temperature=0.2)
                recommended_skills = [s.strip() for s in rec_text.split(",") if s.strip()]

            # 4) save to DB
            # reset file pointer before saving
            try:
                file_obj.seek(0)
            except Exception:
                pass

            resume = Resume.objects.create(
                file=file_obj,
                role=role,
                extracted_skills=", ".join(extracted_skills),
                recommended_skills=", ".join(recommended_skills) if recommended_skills else None
            )
            serializer = ResumeSerializer(resume)

            # 5) return JSON
            return Response({
                "status": "success",
                "data": serializer.data,
                "extracted_skills": extracted_skills,
                "recommended_skills": recommended_skills
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            # In dev show error; in prod log error and hide details.
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

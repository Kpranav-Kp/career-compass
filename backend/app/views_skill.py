from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .utils.skill_service import create_skill_roadmap, analyze_market_relevance

class SkillRoadmapView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        skills = request.data.get('skills', [])
        if not skills:
            return Response(
                {"error": "No skills provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            roadmap = create_skill_roadmap(skills)
            return Response(roadmap)
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SkillMarketAnalysisView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        skills = request.data.get('skills', [])
        if not skills:
            return Response(
                {"error": "No skills provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            analysis = analyze_market_relevance(skills)
            return Response(analysis)
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
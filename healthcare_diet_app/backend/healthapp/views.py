from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import FoodLog, SymptomLog
from .serializers import FoodLogSerializer, SymptomLogSerializer
from django.http import JsonResponse
import os
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class FoodLogListCreateView(generics.ListCreateAPIView):
    queryset = FoodLog.objects.all().order_by('-date', '-created_at')
    serializer_class = FoodLogSerializer
    
    def get_queryset(self):
        queryset = FoodLog.objects.all().order_by('-date', '-created_at')
        date_filter = self.request.query_params.get('date', None)
        if date_filter:
            queryset = queryset.filter(date=date_filter)
        return queryset

class FoodLogRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FoodLog.objects.all()
    serializer_class = FoodLogSerializer

class SymptomLogListCreateView(generics.ListCreateAPIView):
    queryset = SymptomLog.objects.all().order_by('-occurred_at', '-id')
    serializer_class = SymptomLogSerializer

class SymptomLogRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SymptomLog.objects.all()
    serializer_class = SymptomLogSerializer

@api_view(['POST'])
def chatbot_query(request):
    """
    Handle chatbot queries using Gemini API
    """
    try:
        # Get the user's question from the request
        data = request.data
        user_question = data.get('question', '').strip()
        
        if not user_question:
            return Response(
                {'error': 'Question is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Import the medical chatbot API
        try:
            from .medical_chatbot_api import ask_medical_question
        except ImportError as e:
            return Response(
                {'error': f'Medical chatbot module not available: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Get the answer
        answer = ask_medical_question(user_question)
        
        return Response({
            'answer': answer,
            'question': user_question,
            'status': 'success'
        })
            
    except Exception as e:
        return Response(
            {'error': f'Server error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def chatbot_status(request):
    """
    Get the status of the chatbot system
    """
    try:
        from .medical_chatbot_api import get_chatbot_status
        status = get_chatbot_status()
        return Response(status)
    except Exception as e:
        return Response(
            {'error': f'Error getting status: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def api_root(request):
    return JsonResponse({"message": "Welcome to the API root!"})

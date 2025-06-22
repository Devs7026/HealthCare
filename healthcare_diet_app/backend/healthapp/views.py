from rest_framework import generics
from .models import FoodLog
from .serializers import FoodLogSerializer
from django.http import JsonResponse

class FoodLogListCreateView(generics.ListCreateAPIView):
    queryset = FoodLog.objects.all().order_by('-date', '-created_at')
    serializer_class = FoodLogSerializer

class FoodLogRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FoodLog.objects.all()
    serializer_class = FoodLogSerializer

def api_root(request):
    return JsonResponse({"message": "Welcome to the API root!"})

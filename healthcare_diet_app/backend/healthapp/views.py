from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import FoodLog
from .serializers import FoodLogSerializer
from django.http import JsonResponse

class FoodLogCreateView(generics.ListCreateAPIView):
    queryset = FoodLog.objects.all()
    serializer_class = FoodLogSerializer



def api_root(request):
    return JsonResponse({"message": "Welcome to the API root!"})

from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import FoodLog
from .serializers import FoodLogSerializer

class FoodLogCreateView(generics.CreateAPIView):
    queryset = FoodLog.objects.all()
    serializer_class = FoodLogSerializer

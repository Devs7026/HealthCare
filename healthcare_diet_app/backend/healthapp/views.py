from rest_framework import generics
from .models import FoodLog, SymptomLog
from .serializers import FoodLogSerializer, SymptomLogSerializer
from django.http import JsonResponse

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

def api_root(request):
    return JsonResponse({"message": "Welcome to the API root!"})

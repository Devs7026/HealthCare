from django.urls import path
from .views import (
    FoodLogListCreateView,
    FoodLogRetrieveUpdateDestroyView,
    SymptomLogListCreateView,
    SymptomLogRetrieveUpdateDestroyView,
    api_root,
    chatbot_query,
    chatbot_status,
)

urlpatterns = [
    path('', api_root, name='api-root'),
    path('foodlogs/', FoodLogListCreateView.as_view(), name='foodlog-list-create'),
    path('foodlogs/<int:pk>/', FoodLogRetrieveUpdateDestroyView.as_view(), name='foodlog-detail'),
    path('symptoms/', SymptomLogListCreateView.as_view(), name='symptom-list-create'),
    path('symptoms/<int:pk>/', SymptomLogRetrieveUpdateDestroyView.as_view(), name='symptom-detail'),
    path('chatbot/', chatbot_query, name='chatbot-query'),
    path('chatbot/status/', chatbot_status, name='chatbot-status'),
]

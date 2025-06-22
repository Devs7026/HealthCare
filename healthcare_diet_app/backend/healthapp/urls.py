from django.urls import path
from .views import (
    FoodLogListCreateView,
    FoodLogRetrieveUpdateDestroyView,
    api_root,
)

urlpatterns = [
    path('', api_root, name='api-root'),
    path('foodlogs/', FoodLogListCreateView.as_view(), name='foodlog-list-create'),
    path('foodlogs/<int:pk>/', FoodLogRetrieveUpdateDestroyView.as_view(), name='foodlog-detail'),
]

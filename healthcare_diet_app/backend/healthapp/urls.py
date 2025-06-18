from django.urls import path
from .views import FoodLogCreateView

urlpatterns = [
    path('api/foodlogs/', FoodLogCreateView.as_view(), name='foodlog-create'),
]

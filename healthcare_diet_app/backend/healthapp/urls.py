from django.urls import path
from .views import FoodLogCreateView

urlpatterns = [
    path('foodlogs/', FoodLogCreateView.as_view(), name='foodlog-create'),
]

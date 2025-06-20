from django.db import models
from django.utils.timezone import now

# Create your models here.
class FoodLog(models.Model):
    food = models.TextField()
    quantity = models.TextField()
    meal = models.CharField(max_length=50)
    date = models.DateField(default=now)
    created_at = models.DateTimeField(auto_now_add=True)
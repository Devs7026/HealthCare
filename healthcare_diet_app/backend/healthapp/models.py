from django.db import models
from django.utils.timezone import now

# Create your models here.
class FoodLog(models.Model):
    food = models.TextField()
    quantity = models.TextField()
    meal = models.CharField(max_length=50)
    date = models.DateField(default=now)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.food} ({self.meal}) on {self.date}"
    

class SymptomLog(models.Model):
    food_log = models.ForeignKey(FoodLog, on_delete=models.CASCADE, related_name='symptoms')
    symptom = models.CharField(max_length=100)
    severity = models.IntegerField(help_text="Rate severity from 1 (mild) to 10 (severe)")
    notes = models.TextField(blank=True, null=True)
    occurred_at = models.DateTimeField(default=now)

    def __str__(self):
        return f"{self.symptom} (Severity: {self.severity}) for {self.food_log}"
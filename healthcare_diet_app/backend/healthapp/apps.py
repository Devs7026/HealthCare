import os
import sys
from django.apps import AppConfig


class HealthappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'healthapp'

    def ready(self):
        # Run warmup in worker process (avoid running in reloader watcher process)
        if os.environ.get('RUN_MAIN') == 'true' or not any('runserver' in arg for arg in sys.argv):
            try:
                from .medical_chatbot_api import start_background_warmup
                start_background_warmup()
            except Exception:
                pass

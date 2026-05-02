# En backend/create_admin.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

# Usaremos datos muy simples para probar
username = 'admin'
password = 'admin123' # Cambia esto por algo que no olvides
email = 'admin@atheliers.com'

# Esto borra al usuario si ya existía a medias y lo crea de cero
User.objects.filter(username=username).delete()
User.objects.create_superuser(username, email, password)

print(f"🚀 USUARIO '{username}' REESTABLECIDO CON CONTRASEÑA: {password}")
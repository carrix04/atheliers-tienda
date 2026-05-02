import os
import django

# Configuramos el entorno de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings') # Cambia 'core' si tu carpeta se llama distinto
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
username = 'admin'  # Puedes cambiarlo
password = 'TuPasswordSegura123' # Pon una contraseña real
email = 'admin@atheliers.com'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"✅ Superusuario '{username}' creado exitosamente.")
else:
    print(f"⚠️ El usuario '{username}' ya existe.")
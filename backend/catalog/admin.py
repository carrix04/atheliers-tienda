from django.contrib import admin
from .models import Joya

@admin.register(Joya)
class JoyaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio')
from rest_framework import serializers
from .models import Joya

class JoyaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Joya
        fields = [
            'id',
            'nombre',
            'precio',
            'imagen',
            'imagen_2',
            'imagen_3',
            'imagen_4',
            'descripcion',
            'categoria',
        ]
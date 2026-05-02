from rest_framework import serializers
from .models import Joya

class JoyaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Joya
        fields = '__all__'
from rest_framework import viewsets
from .models import Joya
from .serializers import JoyaSerializer

class JoyaViewSet(viewsets.ModelViewSet):
    queryset = Joya.objects.all()
    serializer_class = JoyaSerializer
from django.db import models

class Joya(models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    imagen = models.ImageField(upload_to='joyas/')
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre
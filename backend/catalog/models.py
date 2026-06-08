from django.db import models

class Joya(models.Model):
    CATEGORIAS = [
        ('Anillos', 'Anillos'),
        ('Pulseras', 'Pulseras'),
        ('Collares', 'Collares'),
        ('Otra', 'Otra'),
    ]

    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    imagen = models.ImageField(upload_to='joyas/')
    imagen_2 = models.ImageField(upload_to='joyas/', blank=True, null=True)
    imagen_3 = models.ImageField(upload_to='joyas/', blank=True, null=True)
    imagen_4 = models.ImageField(upload_to='joyas/', blank=True, null=True)

    descripcion = models.TextField(blank=True)
    categoria = models.CharField(max_length=50, choices=CATEGORIAS, default='Otra')

    def __str__(self):
        return self.nombre
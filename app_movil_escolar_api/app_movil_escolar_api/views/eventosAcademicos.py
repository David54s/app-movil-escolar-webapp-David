from django.db.models import *
from django.db import transaction
from app_movil_escolar_api.serializers import UserSerializer
from app_movil_escolar_api.serializers import *
from app_movil_escolar_api.models import *
from django.shortcuts import get_object_or_404
from rest_framework import permissions
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import Group
import json


# CLASE 1: Solo para listar todo (GET lista)
class EventosAcademicosAll(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        # Detectamos los roles
        es_maestro = request.user.groups.filter(name='maestro').exists()
        es_alumno = request.user.groups.filter(name='alumno').exists() 

        if es_maestro:
            # Filtro para Maestros
            eventos = EventosAcademicos.objects.filter(
                Q(publico_objetivo__icontains="Profesores") | 
                Q(publico_objetivo__icontains="Publico General")
            ).order_by("id")
            
        elif es_alumno:
            # Filtro para Alumnos (Estudiantes + Público General)
            eventos = EventosAcademicos.objects.filter(
                Q(publico_objetivo__icontains="Estudiantes") | 
                Q(publico_objetivo__icontains="Publico General")
            ).order_by("id")
            
        else:
            # Admin (ve todo)
            eventos = EventosAcademicos.objects.all().order_by("id")
            
        serializer = EventoAcademicoSerializer(eventos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# CLASE 2: Operaciones CRUD sobre un evento específico o registro
class EventosAcademicosView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    # Obtener un evento por ID 
    def get(self, request, *args, **kwargs):
        # Buscamos el evento usando el ID que viene en la URL 
        evento = get_object_or_404(EventosAcademicos, id=request.GET.get("id"))
        serializer = EventoAcademicoSerializer(evento, many=False) 
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Registrar
    @transaction.atomic
    def post(self, request):
        serializer = EventoAcademicoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Evento registrado correctamente"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    #  Actualizar 
    @transaction.atomic
    def put(self, request, *args, **kwargs):
        evento = get_object_or_404(EventosAcademicos, id=request.data["id"])
        serializer = EventoAcademicoSerializer(evento, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Eliminar 
    @transaction.atomic
    def delete(self, request, *args, **kwargs):
        evento = get_object_or_404(EventosAcademicos, id=request.GET.get("id"))
        try:
            evento.delete()
            return Response({"details": "Evento eliminado"}, 200)
        except Exception as e:
            return Response({"details": "Algo pasó al eliminar"}, 400)
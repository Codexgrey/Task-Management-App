from django.shortcuts import render

# Create your views here.
"""
    viewsets class provides the implementation for CRUD operations by default, 
    what i had to do was specify the serializer class and the query set.
"""
from rest_framework import viewsets          
from .serializers import TodoSerializer      
from .models import Todo                     


class TodoView(viewsets.ModelViewSet):       
    serializer_class = TodoSerializer          
    queryset = Todo.objects.all()              
from django.urls import path
from . import views

urlpatterns = [
    path('transcript/', views.processAudio),
]

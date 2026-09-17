from django.urls import path
from . import views

urlpatterns = [
    path('services', views.services),
    path('services/<int:id>', views.service_detail),

    path('appointments', views.appointments),
    path('appointments/<int:id>/status', views.appointment_status),
    path('appointments/<int:id>', views.appointment_delete),
]
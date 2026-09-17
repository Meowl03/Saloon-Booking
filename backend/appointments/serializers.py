from rest_framework import serializers
from .models import Service, Appointment

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'
        
class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        
    def validate (self, data):
        service = data.get('service')
        date = data.get('appointment_date')
        time = data.get('appointment_time')
        
        if Appointment.objects.filter(
            service = service,
            appointment_date = date,
            appointment_time = time
        ).exists():
            raise serializers.ValidationError("This service is already booked for the selected date and time."
            )
            
            
        return data
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Service, Appointment
from .serializers import ServiceSerializer, AppointmentSerializer


@api_view(['GET', 'POST'])
def services(request):
    if request.method == 'GET':
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

    serializer = ServiceSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['PUT', 'DELETE'])
def service_detail(request, id):
    try:
        service = Service.objects.get(id=id)
    except Service.DoesNotExist:
        return Response(
            {'error': 'Service not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'PUT':
        serializer = ServiceSerializer(
            service,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    service.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def appointments(request):
    if request.method == 'GET':
        appointments = Appointment.objects.select_related('service').all()
        serializer = AppointmentSerializer(
            appointments,
            many=True
        )
        return Response(serializer.data)

    serializer = AppointmentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['PATCH'])
def appointment_status(request, id):
    try:
        appointment = Appointment.objects.get(id=id)
    except Appointment.DoesNotExist:
        return Response(
            {'error': 'Appointment not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    new_status = request.data.get('status')

    valid_statuses = [
        'Pending',
        'Confirmed',
        'Completed',
        'Cancelled'
    ]

    if new_status not in valid_statuses:
        return Response(
            {'error': 'Invalid status'},
            status=status.HTTP_400_BAD_REQUEST
        )

    appointment.status = new_status
    appointment.save()

    return Response(
        AppointmentSerializer(appointment).data
    )


@api_view(['DELETE'])
def appointment_delete(request, id):
    try:
        appointment = Appointment.objects.get(id=id)
    except Appointment.DoesNotExist:
        return Response(
            {'error': 'Appointment not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    appointment.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from .models import MaintenanceRequest
from .serializers import MaintenanceRequestSerializer
from .permissions import IsOperator, IsMaintenanceUser

class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows maintenance requests to be viewed or edited,
    with role-based permissions.
    """
    queryset = MaintenanceRequest.objects.all().order_by('-request_date', '-request_time')
    serializer_class = MaintenanceRequestSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'create':
            permission_classes = [IsAuthenticated, IsOperator]
        elif self.action in ['update', 'partial_update', 'start_maintenance', 'finish_maintenance']:
            permission_classes = [IsAuthenticated, IsMaintenanceUser]
        elif self.action == 'destroy':
            permission_classes = [IsAdminUser]
        else:
            # For 'list' and 'retrieve'
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'], url_path='start')
    def start_maintenance(self, request, pk=None):
        """
        Starts the maintenance for a specific request.
        """
        maintenance_request = self.get_object()
        if maintenance_request.status != 'aberto':
            return Response({'status': 'Manutenção já iniciada ou concluída.'}, status=status.HTTP_400_BAD_REQUEST)

        maintenance_request.status = 'em_andamento'
        maintenance_request.start_datetime = timezone.now()

        # Optionally update technician name when starting
        technician = request.data.get('technician_name')
        if technician:
            maintenance_request.technician_name = technician

        maintenance_request.save()
        serializer = self.get_serializer(maintenance_request)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='finish')
    def finish_maintenance(self, request, pk=None):
        """
        Finishes the maintenance for a specific request.
        """
        maintenance_request = self.get_object()
        if maintenance_request.status != 'em_andamento':
            return Response({'status': 'Manutenção não foi iniciada ou já está concluída.'}, status=status.HTTP_400_BAD_REQUEST)

        maintenance_request.status = 'concluido'
        maintenance_request.end_datetime = timezone.now()

        # Optionally update resolution notes when finishing
        notes = request.data.get('resolution_notes')
        if notes:
            maintenance_request.resolution_notes = notes

        maintenance_request.save()
        serializer = self.get_serializer(maintenance_request)
        return Response(serializer.data)

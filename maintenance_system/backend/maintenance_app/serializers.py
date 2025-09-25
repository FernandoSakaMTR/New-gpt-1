from rest_framework import serializers
from .models import MaintenanceRequest
import datetime

class MaintenanceRequestSerializer(serializers.ModelSerializer):
    maintenance_number = serializers.IntegerField(source='id', read_only=True)
    total_time = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MaintenanceRequest
        # We list all fields explicitly to control the order and include our custom fields
        fields = [
            'id', 'maintenance_number', 'requester_name', 'request_date', 'request_time',
            'department', 'maintenance_type', 'equipment_status', 'equipment_location_press',
            'equipment_location_press_number', 'equipment_location_thread',
            'equipment_location_thread_number', 'equipment_location_other',
            'equipment_location_other_number', 'problem_description',
            'status', 'technician_name', 'start_datetime', 'end_datetime',
            'resolution_notes', 'total_time'
        ]
        read_only_fields = ['id', 'maintenance_number', 'request_date', 'request_time', 'total_time']


    def get_total_time(self, obj):
        if obj.start_datetime and obj.end_datetime:
            duration = obj.end_datetime - obj.start_datetime

            total_seconds = int(duration.total_seconds())
            days = total_seconds // 86400
            hours = (total_seconds % 86400) // 3600
            minutes = (total_seconds % 3600) // 60

            parts = []
            if days > 0:
                parts.append(f"{days}d")
            if hours > 0:
                parts.append(f"{hours}h")
            if minutes > 0:
                parts.append(f"{minutes}m")

            return " ".join(parts) if parts else "0m"
        return None


from rest_framework.permissions import BasePermission

class IsOperator(BasePermission):
    """
    Allows access only to users with the 'operator' role.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'operator'

class IsMaintenanceUser(BasePermission):
    """
    Allows access only to users with the 'maintenance' role.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'maintenance'

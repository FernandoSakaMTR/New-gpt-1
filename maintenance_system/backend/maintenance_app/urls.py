from rest_framework.routers import DefaultRouter
from .views import MaintenanceRequestViewSet

router = DefaultRouter()
router.register(r'maintenance-requests', MaintenanceRequestViewSet)

urlpatterns = router.urls


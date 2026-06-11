from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, JobViewSet, ApplicationViewSet, EmployerApplicationViewSet

router = DefaultRouter()
router.register('companies', CompanyViewSet, basename='company')
router.register('jobs', JobViewSet, basename='job')
router.register('applications', ApplicationViewSet, basename='application')
router.register('employer-applications', EmployerApplicationViewSet, basename='employer-application')

urlpatterns = router.urls
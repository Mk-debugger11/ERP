from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet,
    DesignationViewSet,
    EmploymentTypeViewSet,
    BranchViewSet,
    TeamViewSet,
    EmployeeViewSet,
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'designations', DesignationViewSet, basename='designation')
router.register(r'employment-types', EmploymentTypeViewSet, basename='employment-type')
router.register(r'branches', BranchViewSet, basename='branch')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'employees', EmployeeViewSet, basename='employee')

urlpatterns = router.urls

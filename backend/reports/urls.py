from django.urls import path
from .views import ClinicalReportListCreateView, ClinicalReportDetailView

urlpatterns = [
    path('', ClinicalReportListCreateView.as_view(), name='report-list-create'),
    path('<str:pk>/', ClinicalReportDetailView.as_view(), name='report-detail'),
]

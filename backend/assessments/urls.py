from django.urls import path
from .views import AssessmentTemplateListView, AssessmentRecordListCreateView, AssessmentRecordDetailView

urlpatterns = [
    path('templates/', AssessmentTemplateListView.as_view(), name='assessment-templates'),
    path('records/', AssessmentRecordListCreateView.as_view(), name='assessment-records'),
    path('records/<str:pk>/', AssessmentRecordDetailView.as_view(), name='assessment-record-detail'),
]

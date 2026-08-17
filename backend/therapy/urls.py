from django.urls import path
from .views import (
    TherapyPlanListCreateView,
    TherapyPlanDetailView,
    TherapySessionListCreateView,
    ProgressRecordListCreateView,
)

urlpatterns = [
    path('plans/', TherapyPlanListCreateView.as_view(), name='therapy-plans'),
    path('plans/<str:pk>/', TherapyPlanDetailView.as_view(), name='therapy-plan-detail'),
    path('sessions/', TherapySessionListCreateView.as_view(), name='therapy-sessions'),
    path('progress/', ProgressRecordListCreateView.as_view(), name='therapy-progress'),
]

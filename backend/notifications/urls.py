from django.urls import path
from .views import NotificationListView, NotificationMarkReadView, MessageListCreateView

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('<str:pk>/read/', NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('messages/', MessageListCreateView.as_view(), name='messages-list-create'),
]

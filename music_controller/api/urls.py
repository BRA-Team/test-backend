
from django.urls import path
from .views import RoomView
from .views import CreateRoomView

urlpatterns = [
    path('room', RoomView.as_view()),
    path('create-rooms', CreateRoomView.as_view())
]

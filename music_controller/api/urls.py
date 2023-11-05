
from getpass import GetPassWarning
from django.urls import path
from .views import GetRoom, RoomView
from .views import CreateRoomView

urlpatterns = [
    path('room/', RoomView.as_view()),
    path('create-room/', CreateRoomView.as_view()),
    path('get-room/', GetRoom.as_view())
]

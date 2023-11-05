
from getpass import GetPassWarning
from django.urls import path
from .views import GetRoom, JoinRoom, RoomView, UserInRoom
from .views import CreateRoomView

urlpatterns = [
    path('room/', RoomView.as_view()),
    path('create-room/', CreateRoomView.as_view()),
    path('get-room/', GetRoom.as_view()),
    path('join-room/', JoinRoom.as_view()),
    path('user-in-room/', UserInRoom.as_view())
]

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="home/" element={<HomePage />} />
        <Route path="join/" element={<RoomJoinPage />} />
        <Route path="create/" element={<CreateRoomPage />} />
        <Route path="room/:roomCode" element={<Room />} />
      </Routes>
    </Router>
  );
}

const appDiv = document.getElementById("app");
const root = ReactDOM.createRoot(appDiv);
root.render(
  <div className="center">
    <App />
  </div>
);

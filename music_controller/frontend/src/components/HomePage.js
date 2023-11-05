import React, { useState, useEffect } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import { Link, useNavigate, Navigate } from "react-router-dom";

export default function HomePage() {
  const [roomCode, setRoomCode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      fetch("/api/user-in-room/")
        .then((response) => response.json())
        .then((data) => {
          setRoomCode(data.code);
        });
    };

    fetchData();
  }, []);

  const renderHomePage = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join/" component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to="/create/" component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  };

  const path = "/room/" + roomCode;
  return roomCode != null ? <Navigate to={path} /> : renderHomePage();
}

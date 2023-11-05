import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";

export default function Room(props) {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [roomDetails, setRoomDetails] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
  });

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(`/api/get-room?code=${roomCode}`);
        if (!response.ok) {
          //roomCode = null;
          navigate("/home/");
          return;
        }
        const data = await response.json();
        setRoomDetails({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoomDetails();
  }, [roomCode]);

  const leaveButtonPressed = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    try {
      await fetch("/api/leave-room/", requestOptions);
      //props.leaveRoomCallback();
      navigate("/home/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes: {roomDetails.votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Guest Can Pause: {roomDetails.guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Host: {roomDetails.isHost.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}

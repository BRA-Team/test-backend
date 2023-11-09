import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default function Room(props) {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [roomDetails, setRoomDetails] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
  });
  const [spotifyAuthenticated, setSpotifyAuth] = useState(false);
  const [song, setSong] = useState({});

  useEffect(() => {
    getRoomDetails();
    getCurrentSong();

    const intreval = setInterval(getCurrentSong, 1000);

    return () => {
      clearInterval(intreval);
    };
  }, [roomCode]);

  const getRoomDetails = () => {
    return fetch("/api/get-room/" + "?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
          //this.props.leaveRoomCallback();
          navigate("/home/");
        }
        return response.json();
      })
      .then((data) => {
        setRoomDetails({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
        if (data.is_host) {
          authenticateSpotify();
        }
      });
  };

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          // Handle the case when the response is not OK (e.g., 404 or other errors)
          // You can return an empty object or handle the error as needed
          throw new Error("Response not OK");
        } else {
          return response.json(); // Parse the JSON data
        }
      })
      .then((data) => {
        // Check if the response is not empty before setting the state
        if (Object.keys(data).length > 0) {
          setSong(data);
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch or JSON parsing
        console.error("Error in getCurrentSong:", error);
      });
  };

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuth(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };

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

  const updateShowSettings = (value) => {
    setRoomDetails((prevRoomDetails) => ({
      ...prevRoomDetails,
      showSettings: value,
    }));
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={roomDetails.votesToSkip}
            guestCanPause={roomDetails.guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  const renderRoom = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {roomCode}
          </Typography>
        </Grid>
        <MusicPlayer {...song} />
        {roomDetails.isHost ? renderSettingsButton() : null}
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
  };

  return roomDetails.showSettings == true ? renderSettings() : renderRoom();
}

import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import { Collapse, Alert } from "@material-ui/core";

function CreateRoomPage(props) {
  const [votes, setVotes] = useState(props.votesToSkip);
  const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccesSMsg] = useState("");
  const navigate = useNavigate();

  const handleVotesChange = (e) => {
    setVotes(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true");
  };

  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votes,
        guest_can_pause: guestCanPause,
      }),
    };

    fetch("/api/create-room/", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate("/room/" + data.code));
  };

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votes,
        guest_can_pause: guestCanPause,
        code: props.code,
      }),
    };

    fetch("/api/update-room/", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.ok) {
          setSuccesMsg("Room updated successfully");
        } else {
          setErrMsg("Error updating room...");
        }
      });
  };

  const renderCreateButtons = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            to="/home/"
            component={Link}
          >
            Back
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderUpdateButtons = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={handleUpdateButtonPressed}
        >
          Update
        </Button>
      </Grid>
    );
  };

  const title = props.update ? "Update Room" : "Create Room";

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={errorMsg != "" || successMsg != ""}>
          {successMsg != "" ? (
            <Alert
              severity="success"
              onClose={() => {
                setSuccesSMsg("");
              }}
            >
              {successMsg}
            </Alert>
          ) : (
            <Alert
              severity="error"
              onClose={() => {
                setErrorMsg("");
              }}
            >
              {errorMsg}
            </Alert>
          )}
        </Collapse>
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText component="span">
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue="true"
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={handleVotesChange}
            defaultValue={votes}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText component="span">
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {props.update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
}

CreateRoomPage.defaultProps = {
  votesToSkip: 2,
  guestCanPause: true,
  update: false,
  roomCode: null,
  updateCallback: () => {},
};

export default CreateRoomPage;

import React, { useState, useEffect, useContext } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Box, Alert, Button, Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import StopPoints from "../components/StopPoints";
import { useAuth } from "../helpers/GeneralContext";
import dayjs from "dayjs";
import { TextField } from "@mui/material";
import { LanguageContext } from "../helpers/LanguageContext";

function HomeCarOwner() {
  const { currentUser, rideData, updateUser } = useAuth();
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  const [acceptingRideRequests, setAcceptingRideRequests] = useState(false);
  const [leaveTime, setLeaveTime] = useState(null);
  const [stopPoints, setStopPoints] = useState([]);
  const [changesMade, setChangesMade] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (rideData) {
      setAcceptingRideRequests(rideData.acceptingRideRequests);
      setLeaveTime(dayjs(rideData.leaveTime));
      setStopPoints(rideData.stopPoints || []);
    }
  }, [rideData]);

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const rideDocRef = doc(db, "rides", rideData.docId);
      await updateDoc(rideDocRef, {
        acceptingRideRequests,
        leaveTime: leaveTime.toISOString(),
        stopPoints,
      });
      setChangesMade(false);
      await updateUser(currentUser.email); // Refresh the user data in context
    } catch (error) {
      console.error("Error updating ride data:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAcceptingRideRequestsChange = (event) => {
    setAcceptingRideRequests(event.target.checked);
    setChangesMade(true);
  };

  const handleLeaveTimeChange = (newValue) => {
    setLeaveTime(newValue);
    setChangesMade(true);
  };

  const handleStopPointsChange = (newValue) => {
    setStopPoints(newValue);
    setChangesMade(true);
  };

  return (
    <Box sx={{ padding: "0 24px" }}>
      <h1
        className="h2"
        style={{
          paddingTop: "47px",
          textAlign: "left",
          paddingBottom: "20px",
        }}
      >
        {language.homeCarOwner.home}
      </h1>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>{language.homeCarOwner.acceptingRideRequests}</Box>
        <Box>
          <Switch
            checked={acceptingRideRequests}
            onChange={handleAcceptingRideRequestsChange}
            color="secondary"
          />
        </Box>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          sx={{ marginTop: "24px", width: "100%", marginBottom: "16px" }}
          label={language.homeCarOwner.usualLeavingTime}
          value={leaveTime}
          onChange={handleLeaveTimeChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <StopPoints value={stopPoints} onChange={handleStopPointsChange} />

      <Alert severity="info" sx={{ mt: 2 }}>
        {language.homeCarOwner.stopPointsInfo}
      </Alert>

      {changesMade && (
        <Button
          disableElevation
          variant="contained"
          fullWidth
          type="submit"
          sx={{
            height: "47px",
            textTransform: "none",
            boxShadow: "none",
            borderRadius: "9px",
            marginTop: "24px",
          }}
          onClick={handleSaveChanges}
          disabled={saving}
        >
          {saving
            ? language.homeCarOwner.savingChanges
            : language.homeCarOwner.saveChanges}
        </Button>
      )}
    </Box>
  );
}

export default HomeCarOwner;

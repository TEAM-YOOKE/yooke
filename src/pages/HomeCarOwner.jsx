import React, { useState, useEffect, useContext } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Box, Alert, Button, Switch, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import StopPoints from "../components/StopPoints";
import { useAuth } from "../helpers/GeneralContext";
import dayjs from "dayjs";
import { TextField } from "@mui/material";
import { LanguageContext } from "../helpers/LanguageContext";
import GoogleMapSearchMultiple from "../components/inputs/GoogleMapSearchMultiple";
import useCurrentCarOwnerDoc from "../hooks/currentCarOwnerDoc";
import { database } from "../firebase-config";
import { ref, set, remove } from "firebase/database";
function HomeCarOwner() {
  // const { currentUser, rideData, updateUser } = useAuth();
  const {
    currentUserDoc: currentUser,
    currentUserDocLoading,
    refreshCurrentCarOwnerDoc,
    rideData,
    rideDataLoading,
    refreshRideData,
  } = useCurrentCarOwnerDoc();

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

  useEffect(() => {
    if (!rideData) return;
    setAcceptingRideRequests((prev) => rideData.acceptingRideRequests ?? prev);
    setLeaveTime((prev) =>
      rideData.leaveTime ? dayjs(rideData.leaveTime) : prev
    );
    setStopPoints((prev) => rideData.stopPoints ?? prev);
  }, [rideData]);

  // //watch 1
  // useEffect(() => {
  //   let watchId;
  //   if (rideData?.rideStarted) {
  //     watchId = navigator.geolocation.watchPosition(
  //       async (position) => {
  //         try {
  //           const rideDocRef = doc(db, "rides", rideData.id);
  //           await updateDoc(rideDocRef, {
  //             driverLiveLocation: {
  //               latitude: position.coords.latitude,
  //               longitude: position.coords.longitude,
  //             },
  //           });
  //         } catch (error) {
  //           console.error("Error updating location:", error);
  //         }
  //       },
  //       (error) => console.error("Error getting location:", error),
  //       { enableHighAccuracy: true }
  //     );
  //   }

  //   return () => {
  //     if (watchId) navigator.geolocation.clearWatch(watchId);
  //   };
  // }, [rideData?.rideStarted]);

  //watch 2
  useEffect(() => {
    let watchId;
    if (rideData?.rideStarted) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          try {
            const locationRef = ref(
              database,
              `driverLocations/${rideData.driverId}`
            );
            await set(locationRef, {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: Date.now(),
            });
          } catch (error) {
            console.error("Error updating driver location:", error);
          }
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        // Remove the location when ride ends
        const locationRef = ref(
          database,
          `driverLocations/${rideData.driverId}`
        );
        remove(locationRef);
      }
    };
  }, [rideData?.rideStarted]);

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const rideDocRef = doc(db, "rides", rideData.id);
      await updateDoc(rideDocRef, {
        acceptingRideRequests,
        leaveTime: leaveTime.toISOString(),
        stopPoints,
      });
      setChangesMade(false);
      // await updateUser(currentUser.email); // Refresh the user data in context
      await refreshCurrentCarOwnerDoc();
      await refreshRideData();
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

  const handleRideStarted = async () => {
    if (
      !window.confirm(
        "You are about to start the ride. Are you sure you want to continue?"
      )
    )
      return;

    try {
      const rideDocRef = doc(db, "rides", rideData.id);
      const rideSnapShop = await getDoc(rideDocRef);
      // console.log(rideSnapShop.data().passengers);
      await updateDoc(rideDocRef, {
        rideStarted: true,
        going: rideSnapShop.data().passengers,
      });
    } catch (error) {
      console.error("Error starting ride:", error);
    }
  };

  const handleEndRide = async () => {
    if (
      !window.confirm(
        "You are about to end the ride. Are you sure you want to continue?"
      )
    )
      return;

    try {
      const rideDocRef = doc(db, "rides", rideData.id);
      await updateDoc(rideDocRef, { rideStarted: false, going: [] });
    } catch (error) {
      console.error("Error ending ride:", error);
    }
  };

  return (
    <Box sx={{ padding: "0 24px" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        py={2}
        mb={2}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {language.homeCarOwner.home}
        </Typography>
        <Button
          disableElevation
          variant="contained"
          color={rideData?.rideStarted ? "error" : "success"}
          type="button"
          sx={{
            height: "47px",
            textTransform: "none",
            boxShadow: "none",
            borderRadius: "20px",
          }}
          onClick={rideData?.rideStarted ? handleEndRide : handleRideStarted}
        >
          {rideData?.rideStarted ? "End Ride" : "Start Ride"}
        </Button>
      </Box>

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
            disabled={rideData?.rideStarted}
            checked={acceptingRideRequests}
            onChange={handleAcceptingRideRequestsChange}
            color="secondary"
          />
        </Box>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          disabled={rideData?.rideStarted}
          sx={{ marginTop: "24px", width: "100%", marginBottom: "16px" }}
          label={language.homeCarOwner.usualLeavingTime}
          value={leaveTime}
          onChange={handleLeaveTimeChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      {/* put the google map compoent here for the stop points */}
      <GoogleMapSearchMultiple
        disabled={rideData?.rideStarted}
        value={stopPoints}
        setValue={(newPoints) => {
          setStopPoints(newPoints);
          setChangesMade(true);
        }}
      />

      {/* <StopPoints value={stopPoints} onChange={handleStopPointsChange} /> */}

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
          disabled={saving || rideData?.rideStarted}
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

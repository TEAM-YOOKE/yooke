import React, { useState } from "react";
import PassengerHomeNav from "../components/navbars/PassengerHomeNav";
import RideCard from "../components/cards/RideCard";
import { Box, Snackbar, Alert, Typography } from "@mui/material";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from "../helpers/GeneralContext";
import { db } from "../firebase-config";
import dayjs from "dayjs";
import useCurrentUserDoc from "../hooks/currentUserDoc";
import useUserLocationRides from "../hooks/userLocationRides";

function HomePassenger() {
  const { rides, ridesLoading, ridesError, refreshRides } =
    useUserLocationRides();
  const [loadingRideId, setLoadingRideId] = useState(null);
  console.log("rides-->", rides);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { currentUser: user, updateUser } = useAuth();
  const {
    refreshCurrentUserDoc,
    refreshRideData,
    rideData,
    currentUserDoc: currentUser,
  } = useCurrentUserDoc();

  const handleJoinRide = async (ride) => {
    // check if ride is full and return
    if (ride.passengers.length >= ride.driver.slots) {
      setSnackbar({
        open: true,
        message: "This ride is full.",
        severity: "error",
      });
      return;
    }
    if (currentUser.assignedCar) {
      if (
        window.confirm(
          "Do you want to exit your current ride and join this ride?"
        )
      ) {
        const rideRef = doc(db, "rides", currentUser.assignedCar);
        await updateDoc(rideRef, {
          passengers: arrayRemove(currentUser.id),
        });
        const userDoc = doc(db, "accounts", currentUser.id);
        await updateDoc(userDoc, {
          updatedAt: new Date(),
          assignedCar: null,
        });
        await refreshRides();
        await refreshRideData();
        await refreshCurrentUserDoc();
      }
    }
    const passengerLeaveTime = dayjs(currentUser?.leaveTime);
    const rideLeaveTime = dayjs(ride.leaveTime);

    const passengerLeaveTimeHours = passengerLeaveTime.hour();
    const passengerLeaveTimeMinutes = passengerLeaveTime.minute();

    const rideLeaveTimeHours = rideLeaveTime.hour();
    const rideLeaveTimeMinutes = rideLeaveTime.minute();

    if (
      passengerLeaveTimeHours < rideLeaveTimeHours ||
      (passengerLeaveTimeHours === rideLeaveTimeHours &&
        passengerLeaveTimeMinutes < rideLeaveTimeMinutes)
    ) {
      setSnackbar({
        open: true,
        message: "Your pick up time must be after the ride's leave time.",
        severity: "error",
      });
      return;
    }
    setLoadingRideId(ride.id);
    try {
      const rideRef = doc(db, "rides", ride.id);
      await updateDoc(rideRef, {
        passengers: arrayUnion(currentUser.id),
      });
      const userDoc = doc(db, "accounts", currentUser.id);
      await updateDoc(userDoc, {
        updatedAt: new Date(),
        assignedCar: ride.id,
      });
      await refreshRides();
      await refreshCurrentUserDoc();
      await refreshRideData();
      setSnackbar({
        open: true,
        message: "Joined the ride successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error joining ride:", error);
      setSnackbar({
        open: true,
        message: "Failed to join the ride",
        severity: "error",
      });
    } finally {
      setLoadingRideId(null);
    }
  };
  const handleExitRide = async (ride) => {
    if (!window.confirm("Are you sure you want to exit this ride?")) return;
    setLoadingRideId(ride.id);
    try {
      const rideRef = doc(db, "rides", ride.id);
      await updateDoc(rideRef, {
        passengers: arrayRemove(currentUser.id),
      });
      const userDoc = doc(db, "accounts", currentUser.id);
      await updateDoc(userDoc, {
        updatedAt: new Date(),
        assignedCar: null,
      });
      await refreshRides();
      await refreshCurrentUserDoc();
      await refreshRideData();

      setSnackbar({
        open: true,
        message: "Exited the ride successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error exiting ride:", error);
      setSnackbar({
        open: true,
        message: "Failed to exit the ride",
        severity: "error",
      });
    } finally {
      setLoadingRideId(null);
    }
  };

  return (
    <Box height="100vh">
      <PassengerHomeNav />
      <Box px={2} py={3}>
        <Typography component="h4" fontWeight="bold">
          Available Rides
        </Typography>
        {ridesLoading ? (
          <p>Loading rides...</p>
        ) : ridesError ? (
          <p>Error: {ridesError.message}</p>
        ) : rides && rides.length > 0 ? (
          rides.map((ride, index) => (
            <RideCard
              onJoinRide={handleJoinRide}
              onExitRide={handleExitRide}
              currentUser={currentUser}
              key={index}
              ride={ride}
              disableAllButtons={
                loadingRideId !== null && loadingRideId !== ride.id
              }
            />
          ))
        ) : (
          <p>No rides available.</p>
        )}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            sx={{ borderRadius: "40px" }}
            severity={snackbar.severity}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default HomePassenger;

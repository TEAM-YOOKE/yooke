import React, { useState } from "react";
import PassengerHomeNav from "../components/navbars/PassengerHomeNav";
import RideCard from "../components/cards/RideCard";
import { Box, Snackbar, Alert, Typography, Skeleton } from "@mui/material";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from "../helpers/GeneralContext";
import { db } from "../firebase-config";
import dayjs from "dayjs";
import useCurrentUserDoc from "../hooks/currentUserDoc";
import useUserLocationRides from "../hooks/userLocationRides";

const loadingSkeletons = [1, 2, 3];

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
        {/* Check if the pick-up location is not set */}
        {!currentUser?.pickUpLocation ? (
          <Box sx={{ textAlign: "center", marginTop: 4 }}>
            <img
              src="/location_not_set.svg"
              width="150px"
              style={{ marginTop: "40px" }}
              alt="Pick-up Location Not Set"
            />
            <Typography sx={{ opacity: 0.6, marginTop: 1 }}>
              Please set your pick-up location to find available rides
            </Typography>
          </Box>
        ) : ridesLoading ? (
          // Show loading skeletons while rides are loading
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            mt={2}
            justifyContent="center"
            alignItems="center"
          >
            {loadingSkeletons.map((_, index) => (
              <Skeleton
                key={index}
                sx={{ width: "100%", borderRadius: 2 }}
                variant="rectangular"
                height={180}
              />
            ))}
          </Box>
        ) : ridesError ? (
          // Handle error state
          <Typography
            sx={{ color: "error.main", textAlign: "center", marginTop: 4 }}
          >
            Error: {ridesError.message}
          </Typography>
        ) : rides && rides.length > 0 ? (
          // Show available rides
          <>
            <Typography component="h4" fontWeight="bold" mb={2}>
              Available Rides
            </Typography>
            {rides.map((ride, index) => (
              <RideCard
                key={index}
                onJoinRide={handleJoinRide}
                onExitRide={handleExitRide}
                currentUser={currentUser}
                ride={ride}
                disableAllButtons={
                  loadingRideId !== null && loadingRideId !== ride.id
                }
              />
            ))}
          </>
        ) : (
          // Handle no rides available
          <Box sx={{ textAlign: "center", marginTop: 4 }}>
            <img
              src="/empty.png"
              width="150px"
              style={{ marginTop: "40px" }}
              alt="No Rides Available"
            />
            <Typography sx={{ opacity: 0.6, marginTop: 1 }}>
              No Rides Available
            </Typography>
          </Box>
        )}

        {/* Snackbar for user feedback */}
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

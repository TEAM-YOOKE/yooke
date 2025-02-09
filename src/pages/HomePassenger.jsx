import React, { useEffect, useState } from "react";
import PassengerHomeNav from "../components/navbars/PassengerHomeNav";
import RideCard from "../components/cards/RideCard";
import {
  Box,
  Snackbar,
  Alert,
  Typography,
  Skeleton,
  Button,
  AlertTitle,
} from "@mui/material";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from "../helpers/GeneralContext";
import { db } from "../firebase-config";
import dayjs from "dayjs";
import useCurrentUserDoc from "../hooks/currentUserDoc";
import useUserLocationRides from "../hooks/userLocationRides";
import SetAddress from "../modals/SetAddress";

function HomePassenger() {
  const {
    refreshCurrentUserDoc,
    // refreshRideData,
    rideData,
    currentUserDoc: currentUser,
    currentUserDocLoading,
  } = useCurrentUserDoc();
  const { rides, ridesLoading, ridesError, refreshRides } =
    useUserLocationRides();

  const [loadingRideId, setLoadingRideId] = useState(null);
  const [openSetAddress, setOpenSetAddress] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // console logs
  console.log("rides", rides);
  console.log("rideData", rideData);
  console.log("currentUser", currentUser);

  // useEffect(() => {
  //   let lat = "";
  //   let lng = "";
  //   var geocoder = new window.google.maps.Geocoder();

  //   if (currentUser?.pickUpLocation) {
  //     geocoder.geocode(
  //       {
  //         address: currentUser?.pickUpLocation,
  //       },
  //       function (results, status) {
  //         if (status === "OK") {
  //           lat = results[0].geometry.location.lat();
  //           lng = results[0].geometry.location.lng();
  //           console.log("longitude->", lng);
  //           console.log("latitude", lat);

  //           // loadMapDetails(lat, lng);
  //         } else {
  //           console.log(
  //             "Geocode was not successful for the following reason: " + status
  //           );
  //         }
  //       }
  //     );
  //   }
  // }, [currentUser, rides]);

  useEffect(() => {
    const directionsService = new window.google.maps.DirectionsService();
    if (rides.length > 0) {
      directionsService.route(
        {
          // origin: currentUser?.pickUpLocation,
          // destination: rides[1]?.stopPoints[0],
          origin: "Afrikiko",
          destination: "Legon Campus",
          travelMode: window.google.maps.TravelMode.DRIVING,
          // travelMode: window.google.maps.TravelMode.TRANSIT,
          transitOptions: {
            modes: [window.google.maps.TransitMode.BUS],
          },
          drivingOptions: {
            departureTime: new Date(Date.now() + 1000), // 1 second from now
            trafficModel: "bestguess",
          },
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            const legs = result.routes[0].legs[0]; // first leg of route

            // const transitDetails = [];
            // legs.steps.forEach((step) => {
            //   console.log("step2:", step);
            //   if (step.transit) {
            //     const { line, stops } = step.transit;
            //     const stopDetails = {
            //       departureStop: step.transit.departure_stop.name,
            //       arrivalStop: step.transit.arrival_stop.name,
            //       numberOfStops: step.transit.num_stops,
            //       busLine: line.short_name || line.name,
            //       agency: line.agencies[0]?.name,
            //     };
            //     transitDetails.push(stopDetails);
            //   }
            // });

            //Distance and duration
            const distance = legs.distance.text;
            const duration = Math.round(legs.duration_in_traffic.value / 60);
            console.log(`Duration: ${duration}, Distance: ${distance}`);

            // Transit stations (steps)
            const steps = legs.steps;
            const transitStations = steps.map((step, index) => {
              const { instructions, distance, duration } = step;
              return {
                station: instructions,
                distance: distance.text,
                duration: duration.text,
              };
            });
            console.log("Transit stations:", transitStations);
          } else {
            console.error("Failed to get directions:", status);
          }
        }
      );
    }
  }, [rides]);

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
        !window.confirm(
          "Do you want to exit your current ride and join this ride?"
        )
      )
        return;
      else {
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
        // await refreshRideData();
        await refreshCurrentUserDoc();
      }
    }
    // const passengerLeaveTime = dayjs(currentUser?.leaveTime);
    // const rideLeaveTime = dayjs(ride.leaveTime);

    // const passengerLeaveTimeHours = passengerLeaveTime.hour();
    // const passengerLeaveTimeMinutes = passengerLeaveTime.minute();

    // const rideLeaveTimeHours = rideLeaveTime.hour();
    // const rideLeaveTimeMinutes = rideLeaveTime.minute();

    // if (
    //   passengerLeaveTimeHours < rideLeaveTimeHours ||
    //   (passengerLeaveTimeHours === rideLeaveTimeHours &&
    //     passengerLeaveTimeMinutes < rideLeaveTimeMinutes)
    // ) {
    //   setSnackbar({
    //     open: true,
    //     message: "Your pick up time must be after the ride's leave time.",
    //     severity: "error",
    //   });
    //   return;
    // }
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
      // await refreshRideData();
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
      // await refreshRideData();

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
      <Alert severity="info" sx={{ mt: 2 }}>
        All payment terms and conditions must be negotiated directly between you
        and the car owner!
      </Alert>

      {rideData?.rideStarted && rideData?.going.includes(currentUser?.id) && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.5)", // Light overlay
            backdropFilter: "blur(4px)", // Apply blur
            // pointerEvents: "none", // Disable clicks
            zIndex: 10,
          }}
        />
      )}
      <Box px={2} py={3}>
        {/* Check if the pick-up location is not set */}
        {ridesLoading || currentUserDocLoading ? (
          // Show loading skeletons while rides are loading
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            mt={2}
            justifyContent="center"
            alignItems="center"
          >
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  sx={{ width: "100%", borderRadius: 2 }}
                  variant="rectangular"
                  height={180}
                />
              ))}
          </Box>
        ) : !currentUser?.pickUpLocation ? (
          <Box
            sx={{
              textAlign: "center",

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <img
              src="/location_not_set.svg"
              width="150px"
              style={{ marginTop: "40px" }}
              alt="Pick-up Location Not Set"
            />
            <Typography sx={{ opacity: 0.6, marginTop: 1 }}>
              Please set your pick-up location to find available rides
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenSetAddress(true)}
              sx={{
                color: "white",
                borderRadius: "20px",
                height: "100%",
              }}
            >
              Set Location
            </Button>
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
      <SetAddress
        open={openSetAddress}
        onClose={() => setOpenSetAddress(false)}
      />
    </Box>
  );
}

export default HomePassenger;

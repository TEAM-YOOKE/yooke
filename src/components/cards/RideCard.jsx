import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Step,
  StepLabel,
  Stepper,
  Typography,
  StepConnector,
  Button,
  StepContent,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import ToysIcon from "@mui/icons-material/Toys";
import { styled } from "@mui/system";
import Grid from "@mui/material/Grid2";
// Custom Step Connector styling
const CustomStepConnector = styled(StepConnector)(() => ({
  "& .MuiStepConnector-line": {
    borderColor: "#33bdbd",
    // marginTop: "-8px",
  },
}));

// Custom Step Icon styling
const CustomStepIcon1 = () => (
  // <Box
  //   sx={{
  //     width: 7,
  //     height: 7,
  //     borderRadius: "50%",
  //     bgcolor: "#33bdbd",
  //   }}
  // />
  <ToysIcon sx={{ color: "#33bdbd" }} />
);

const CustomStepIcon2 = () => <PersonPinIcon sx={{ color: "#33bdbd" }} />;

const RideCard = ({
  ride,
  onJoinRide,
  currentUser,
  onExitRide,
  disableAllButtons,
}) => {
  const isPassenger = ride.passengers.includes(currentUser.id);
  const [loading, setLoading] = useState(false);
  const [arrivalTime, setArrivalTime] = useState(null);

  console.log("ride", ride);

  // Calculate arrival time after 10seconds
  // useEffect(() => {
  //   const directionsService = new window.google.maps.DirectionsService();

  //   // Function to get directions and calculate arrival time
  //   const getDirections = () => {
  //     directionsService.route(
  //       {
  //         origin: new window.google.maps.LatLng(
  //           currentUser?.pickUpLocation?.pinLocation.lat,
  //           currentUser?.pickUpLocation?.pinLocation.lng
  //         ),
  //         destination: ride?.stopPoints[0],
  //         travelMode: window.google.maps.TravelMode.DRIVING,
  //         drivingOptions: {
  //           departureTime: new Date(Date.now() + 1000), // 1 second from now
  //           trafficModel: "bestguess",
  //         },
  //       },
  //       (result, status) => {
  //         if (status === window.google.maps.DirectionsStatus.OK) {
  //           // Get the distance from the result object
  //           const distance = result.routes[0].legs[0].distance.text;
  //           const duration = Math.round(
  //             result.routes[0].legs[0].duration_in_traffic.value / 60
  //           );

  //           // Do something with the distance and directions
  //           console.log(`Duration: ${duration}`);
  //           const carLeaveDate = new Date(ride?.leaveTime);
  //           const durationInMilliseconds = duration * 60 * 1000; // Convert minutes to milliseconds
  //           const updatedDate = new Date(
  //             carLeaveDate.getTime() + durationInMilliseconds
  //           ).toISOString();

  //           setArrivalTime(
  //             new Date(updatedDate).toLocaleTimeString("en-US", {
  //               hour: "2-digit",
  //               minute: "2-digit",
  //             })
  //           );
  //         }
  //       }
  //     );
  //   };

  //   // Set interval to call getDirections every 10 seconds
  //   const intervalId = setInterval(getDirections, 10000); // 10 seconds in milliseconds

  //   // Run immediately once when the component mounts
  //   getDirections();

  //   // Clean up the interval when the component unmounts or re-renders
  //   return () => clearInterval(intervalId);
  // }, []);

  useEffect(() => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(
          currentUser?.pickUpLocation?.pinLocation.lat,
          currentUser?.pickUpLocation?.pinLocation.lng
        ),
        // destination: new window.google.maps.LatLng(),
        destination: ride?.stopPoints[0],
        travelMode: window.google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(Date.now() + 1000), // 1 second from now
          trafficModel: "bestguess",
        },
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          // Get the distance from the result object
          const distance = result.routes[0].legs[0].distance.text;
          const duration = Math.round(
            result.routes[0].legs[0].duration_in_traffic.value / 60
          );

          // Do something with the distance and directions
          console.log(`Duration: ${duration}`);
          const carLeaveDate = new Date(ride?.leaveTime);
          const durationInMilliseconds = duration * 60 * 1000; // Convert minutes to milliseconds
          const updatedDate = new Date(
            carLeaveDate.getTime() + durationInMilliseconds
          ).toISOString();

          setArrivalTime(
            new Date(updatedDate).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        }
      }
    );
  }, []);
  const handleButtonClick = async (ride) => {
    try {
      setLoading(true);
      if (isPassenger) {
        await onExitRide(ride);
      } else {
        await onJoinRide(ride);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        border:
          currentUser?.assignedCar === ride.id
            ? "2px solid rgb(68, 218, 245)"
            : "0.5px solid #33bdbd",
        borderRadius: 2,
        bgcolor: "white",
        boxShadow: 1,
        padding: 2,
        my: 3,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Stepper Section */}
        <Stepper
          alternativeLabel
          connector={<CustomStepConnector />}
          sx={{ padding: 0 }}
        >
          {/* {ride.stopPoints.map((label, index) => ( */}
          <Step sx={{ alignItems: "left" }}>
            <StepLabel StepIconComponent={CustomStepIcon1}></StepLabel>
            <Typography textAlign="center" fontSize="13px">
              {ride.stopPoints[0]}
              {/* {label} */}
            </Typography>
            {/* <Typography textAlign="center" fontSize="12px">
              {ride.driver?.carName} - ({ride.driver.carPlate})
            </Typography> */}
            <Typography
              fontSize="12px"
              fontWeight={"bold"}
              textAlign="center"
              // color="text.secondary"
            >
              {new Date(ride.leaveTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Step>
          <Step>
            <StepLabel StepIconComponent={CustomStepIcon2}></StepLabel>
            <Typography textAlign="center" fontSize="13px">
              {currentUser?.pickUpLocation?.address?.structured_formatting
                ?.main_text || currentUser?.pickUpLocation}
            </Typography>
            <Typography
              fontSize="12px"
              fontWeight={"bold"}
              textAlign="center"
              // color="text.secondary"
            >
              {arrivalTime}
            </Typography>
          </Step>
          {/* ))} */}
        </Stepper>
        {/* Ride Information */}
        {/* <Grid container spacing={2} mt={2} px={1}>
          <Grid size={4}>
            <Box
              display="flex"
              flexDirection="column"
              justifyItems="center"
              alignItems="center"
            >
              <DirectionsCarIcon fontSize="small" color="disabled" />
              <Typography textAlign="center" fontSize="12px">
                {ride.driver?.carName}{" "}
              </Typography>
              <Typography textAlign="center" fontSize="12px">
                {ride.driver.carPlate ?? "N/A"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={3}>
            <Box
              display="flex"
              flexDirection="column"
              justifyItems="center"
              alignItems="center"
            >
              <AccessTimeIcon fontSize="small" color="disabled" />
              <Typography
                fontSize="12px"
                fontWeight={"bold"}
                // color="text.secondary"
              >
                {new Date(ride.leaveTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          </Grid>
          <Grid size={4}>
            <Box
              display="flex"
              flexDirection="column"
              justifyItems="center"
              alignItems="center"
            >
              <PersonPinIcon fontSize="small" color="disabled" />
              <Typography fontSize="12px">{ride.driver?.username}</Typography>
            </Box>
          </Grid>
          <Grid size={1}>
            <Box
              display="flex"
              flexDirection="column"
              justifyItems="center"
              alignItems="center"
            >
              <GroupsIcon fontSize="small" color="disabled" />
              {ride.driver.slots ? (
                <Typography fontSize="12px">
                  {ride.passengers.length}/{ride.driver.slots}
                </Typography>
              ) : (
                <Typography fontSize="12px">N/A</Typography>
              )}
            </Box>
          </Grid>
        </Grid> */}
        {/* Join/Exit Ride Button */}
        <Grid container spacing={2} mt={2} px={1}>
          <Grid size={4}>
            <Box
              display="flex"
              flexDirection="column"
              justifyItems="center"
              alignItems="center"
            >
              <GroupsIcon fontSize="small" color="disabled" />
              {ride.driver.slots ? (
                <Typography fontSize="12px">
                  {ride.passengers.length}/{ride.driver.slots}
                </Typography>
              ) : (
                <Typography fontSize="12px">N/A</Typography>
              )}
            </Box>
          </Grid>
          <Grid size={8}>
            <Box
              display="flex"
              flexDirection="column"
              justifyItems="flex-end"
              alignItems="end"
              width="100%"
            >
              <Button
                variant="contained"
                sx={{
                  bgcolor: loading
                    ? "#aaa" // Gray color for loading state
                    : isPassenger
                    ? "red" // Red color if the user is already a passenger
                    : "#22CEA6", // Default color for joining a ride
                  color: "white",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  width: "80%",

                  "&:hover": {
                    bgcolor: isPassenger ? "darkred" : "#2aa1a1",
                  },
                }}
                onClick={() => handleButtonClick(ride)}
                disabled={
                  loading ||
                  disableAllButtons ||
                  (ride.passengers.length >= ride.driver.slots && !isPassenger)
                }
              >
                {loading
                  ? "Loading..."
                  : isPassenger
                  ? "Exit Ride"
                  : ride.passengers.length >= ride.driver.slots
                  ? "Ride full"
                  : "Join Ride"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default RideCard;

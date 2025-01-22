import { Box, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
const PassengerCard = ({ passenger, rideData }) => {
  const [arrivalTime, setArrivalTime] = useState(null);

  useEffect(() => {
    console.log("Ride data-->", rideData);
    if (!rideData) return;
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(
          passenger?.pickUpLocation?.pinLocation.lat,
          passenger?.pickUpLocation?.pinLocation.lng
        ),
        // destination: new window.google.maps.LatLng(),
        destination: rideData?.stopPoints[0],
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
          const carLeaveDate = new Date(rideData?.leaveTime);
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
  }, [passenger, rideData]);

  return (
    <Card
      sx={{
        border: "0.5px solid #33bdbd",
        borderRadius: 2,
        bgcolor: "white",
        boxShadow: 1,
        padding: 2,
        my: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          //   alignItems: "center",
          gap: 1,
          fontSize: "11px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <LocationOnIcon fontSize="small" />
          <Typography fontSize="13px">
            {
              passenger?.pickUpLocation?.address?.structured_formatting
                ?.main_text
            }
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AccessTimeIcon fontSize="small" />
          <Typography fontSize="13px">{arrivalTime || 0}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <PersonIcon fontSize="small" />
          <Typography fontSize="13px">
            {passenger?.username || "Kofi"}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default PassengerCard;

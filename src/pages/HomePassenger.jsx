import React, { useState } from "react";
import PassengerHomeNav from "../components/navbars/PassengerHomeNav";
import useRides from "../hooks/rides";
import RideCard from "../components/cards/RideCard";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Slide,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";

function HomePassenger() {
  const { rides, ridesLoading, ridesError, refreshRides } = useRides();
  console.log("rides--->", rides);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
        ) : rides ? (
          rides.map((ride, index) => {
            return <RideCard key={index} ride={ride} />;
          })
        ) : (
          <p>No rides available.</p>
        )}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "middle" }}
          // TransitionComponent={<Slide direction="left" />}
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            sx={{ borderRadius: "40px" }}
            severity={snackbar.severity}
            // variant="filled"
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

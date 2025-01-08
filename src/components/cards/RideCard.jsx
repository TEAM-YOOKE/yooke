import React, { useState } from "react";
import {
  Box,
  Card,
  Step,
  StepLabel,
  Stepper,
  Typography,
  StepConnector,
  Button,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonPinIcon from "@mui/icons-material/PersonPin";

import { styled } from "@mui/system";
import Grid from "@mui/material/Grid2";
// Custom Step Connector styling
const CustomStepConnector = styled(StepConnector)(() => ({
  "& .MuiStepConnector-line": {
    borderColor: "#33bdbd",
    marginTop: "-8px",
  },
}));

// Custom Step Icon styling
const CustomStepIcon = () => (
  <Box
    sx={{
      width: 8,
      height: 8,
      borderRadius: "50%",
      bgcolor: "#33bdbd",
    }}
  />
);

const RideCard = ({
  ride,
  onJoinRide,
  currentUser,
  onExitRide,
  disableAllButtons,
}) => {
  const isPassenger = ride.passengers.includes(currentUser.id);
  const [loading, setLoading] = useState(false);
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
        border: "1px solid #33bdbd",
        borderRadius: 2,
        bgcolor: "white",
        boxShadow: 1,
        padding: 2,
        my: 2,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Stepper Section */}
        <Stepper
          alternativeLabel
          connector={<CustomStepConnector />}
          sx={{ padding: 0 }}
        >
          {ride.stopPoints.map((label, index) => (
            <Step key={index}>
              <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Ride Information */}
        <Grid container spacing={2} mt={2} px={1}>
          <Grid size={4.5}>
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
          <Grid size={4.5}>
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
        </Grid>

        {/* Join/Exit Ride Button */}
        <Button
          variant="contained"
          sx={{
            alignSelf: "end",
            bgcolor: loading
              ? "#aaa" // Gray color for loading state
              : isPassenger
              ? "red" // Red color if the user is already a passenger
              : "#33bdbd", // Default color for joining a ride
            color: "white",
            borderRadius: "20px",
            fontWeight: "bold",
            width: "50%",
            "&:hover": {
              bgcolor: isPassenger ? "darkred" : "#2aa1a1",
            },
          }}
          onClick={() => handleButtonClick(ride)}
          disabled={loading || disableAllButtons}
        >
          {loading ? "Loading..." : isPassenger ? "Exit Ride" : "Join Ride"}
        </Button>
      </Box>
    </Card>
  );
};

export default RideCard;

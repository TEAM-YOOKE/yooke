import React from "react";
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
import { styled } from "@mui/system";

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

const RideCard = ({ ride, onJoinRide, currentUser, onExitRide, loading }) => {
  const isPassenger = ride.passengers.includes(currentUser.id);
  const handleButtonClick = (ride) => {
    if (isPassenger) {
      onExitRide(ride);
    } else {
      onJoinRide(ride);
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography fontSize="16px" fontWeight="bold">
            {ride.driver?.carName} - {ride.driver.carPlate ?? "N/A"}
          </Typography>
          <Typography fontSize="14px" color="text.secondary">
            Driver - {ride.driver?.username}
          </Typography>
          <Typography
            fontSize="14px"
            fontWeight={"bold"}
            // color="text.secondary"
          >
            Leave time -{" "}
            {new Date(ride.leaveTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>

        {/* Join/Exit Ride Button */}
        <Button
          variant="contained"
          sx={{
            mt: 2,
            alignSelf: "center",
            bgcolor: isPassenger ? "red" : "#33bdbd",
            color: "white",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: isPassenger ? "darkred" : "#2aa1a1",
            },
          }}
          onClick={() => handleButtonClick(ride)}
          disabled={loading}
        >
          {loading ? "Loading..." : isPassenger ? "Exit Ride" : "Join Ride"}
        </Button>
      </Box>
    </Card>
  );
};

export default RideCard;

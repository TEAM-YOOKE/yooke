import {
  Box,
  Card,
  Step,
  StepLabel,
  Stepper,
  Typography,
  StepConnector,
} from "@mui/material";
import React from "react";
import { styled } from "@mui/system";

const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  "& .MuiStepConnector-line": {
    borderColor: "#33bdbd", // Customize the connector color
    marginTop: "-8px",
  },
}));

const CustomStepIcon = () => (
  <Box
    sx={{
      width: 8,
      height: 8,
      borderRadius: "50%",
      bgcolor: "#33bdbd", // Customize the dot color
    }}
  />
);

const RideCard = ({ ride }) => {
  return (
    <Card
      sx={{
        border: "1px solid #33bdbd",
        borderRadius: 2,
        bgcolor: "white",
        boxShadow: 1,
        padding: 2,
        cursor: "default",
        my: 2,
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 3,
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Stepper */}
        <Box>
          <Stepper
            alternativeLabel
            connector={<CustomStepConnector />}
            sx={{
              padding: 0,
            }}
          >
            {ride.stopPoints.map((label) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={CustomStepIcon}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Ride Info */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography fontSize="16px" fontWeight="bold">
            {ride.carName} - ABC-123
          </Typography>
          <Typography fontSize="14px" color="text.secondary">
            Driver - {ride.driverName}
          </Typography>
          <Typography fontSize="14px" color="text.secondary">
            Leave time -{" "}
            {new Date(ride.leaveTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default RideCard;

import React from "react";
import { Box, Button, Typography, TextField, Chip, Grid } from "@mui/material";
import CarCard from "../components/CarCard";
import { RECURRING_RIDES } from "../constants";
import Grid2 from "@mui/material/Unstable_Grid2";

const RecurringRides = () => {
  return (
    <Grid2 container p={2}>
      {/* Left Section */}
      <Grid2 size={4}>
        <Button
          variant="contained"
          type="button"
          sx={{
            height: "47px",
            textTransform: "none",
            boxShadow: "none",
            borderRadius: "9px",
            marginY: 1,
          }}
        >
          Add new car
        </Button>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {RECURRING_RIDES.map((car, index) => (
            <CarCard car={car} key={index} />
          ))}
        </Box>
      </Grid2>

      {/* Right Section */}
      <Grid p={8}>
        <Box>
          <Typography variant="h6">
            Rides for car with model: <b>xxx</b> and driver <b>xxx</b>
          </Typography>
          <Box sx={{ display: "flex", gap: 4 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Select person"
              sx={{ marginBottom: 2 }}
            />

            <Button
              variant="contained"
              disableElevation
              sx={{
                height: "47px",
                textTransform: "none",
                boxShadow: "none",
                borderRadius: "9px",
                marginBottom: "16px",
              }}
            >
              Add to this ride
            </Button>
          </Box>
        </Box>

        {/* Selected People */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {["Person 1", "Person 2", "Person 3", "Person 4"].map(
            (person, index) => (
              <Chip
                key={index}
                label={person}
                onDelete={() => {}}
                sx={{
                  backgroundColor: "#e9f5f9",
                  color: "#333",
                  fontWeight: "bold",
                }}
              />
            )
          )}
        </Box>

        {/* Additional Information */}
        <Typography variant="body1">
          Who is going where? Name + place they are going
        </Typography>
      </Grid>
    </Grid2>
  );
};

export default RecurringRides;

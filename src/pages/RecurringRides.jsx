import React, { useState } from "react";
import { Box, Button, Typography, TextField, Chip, Grid } from "@mui/material";
import CarCard from "../components/CarCard";
import { PEOPLE, RECURRING_RIDES } from "../constants";
import Grid2 from "@mui/material/Unstable_Grid2";
import Autocomplete from "@mui/material/Autocomplete";

const RecurringRides = () => {
  const [selectedCar, setSelectedCar] = useState({});
  const [selectedPerson, setSelectedPerson] = useState({});

  const handleCarSelect = (car) => {
    console.log(car);
    setSelectedCar(car);
  };

  const handleAddPersonToCar = (e) => {
    e.preventDefault();
    console.log(selectedCar);
    console.log(selectedPerson);

    // Update the selectedCar state immutably
    setSelectedCar((prev) => {

      prev= {
        ...prev,
        passengers: [...(prev.passengers || []), selectedPerson],
      };
      return prev
    });
  };

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
            <Box
              key={index}
              cursor="pointer"
              onClick={() => handleCarSelect(car)}
            >
              <CarCard car={car} />
            </Box>
          ))}
        </Box>
      </Grid2>

      {/* Right Section */}
      <Grid p={8}>
        <Box component="form" onSubmit={handleAddPersonToCar}>
          <Typography variant="h6">
            Rides for car with model: <b>{selectedCar.model || "xxx"}</b> and
            driver <b>{selectedCar.driverName || "xxx"}</b>
          </Typography>
          <Box sx={{ display: "flex", gap: 4 }}>
            <Autocomplete
              disablePortal
              options={PEOPLE}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => setSelectedPerson(newValue)}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField name="person" {...params} label="Select Person" />
              )}
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
              type="submit"
            >
              Add to this ride
            </Button>
          </Box>
        </Box>

        {/* Selected People */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {selectedCar?.passengers?.map((passenger, index) => (
            <Chip
              key={index}
              label={passenger.name}
              onDelete={() => {
                // Optional: Handle passenger deletion
                setSelectedCar((prev) => ({
                  ...prev,
                  passengers: prev.passengers.filter((_, i) => i !== index),
                }));
              }}
              sx={{
                backgroundColor: "#e9f5f9",
                color: "#333",
                fontWeight: "bold",
              }}
            />
          ))}
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

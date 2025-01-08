import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Grid from "@mui/material/Grid2";
import { Box, Typography } from "@mui/material";
import CarCard from "../components/cards/CarCard";
import { PEOPLE, RECURRING_RIDES } from "../constants";
import PeopleWithoutRidesCard from "../components/PeopleWithoutRidesCard";
import { getDocs, query, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import CircularProgressLoading from "../components/feedbacks/CircularProgressLoading";
import useCars from "../hooks/cars";
import usePassengers from "../hooks/passengers";
const Calendar = () => {
  const [value, setValue] = React.useState(dayjs("2024-11-21"));

  const handleCarChange = (event, newValue) => {
    console.log(newValue);
  };

  const { cars, carsLoading, refreshCars, carsError } = useCars();
  const { passengers, passengersLoading, refreshPassengers, passengersError } =
    usePassengers();

  console.log("passengers", passengers);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3} position="relative">
          <Box
            sx={{
              border: "1px solid #33bdbd",
              borderRadius: 2,
              backgroundColor: "#f0fbfb",
              boxShadow: 3,
              cursor: "pointer",
              // width: "100%",
              my: 2,
              position: "fixed",
              top: 120,
              left: 15,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={value}
                onChange={(newValue) => setValue(newValue)}
              />
            </LocalizationProvider>
          </Box>
        </Grid>
        <Grid item md={9}>
          <Grid container p={2} columnSpacing={8}>
            <Grid md={7} item size={4}>
              <Typography variant="h6" fontWeight="bold">
                Recurring Rides
              </Typography>
              {carsLoading ? (
                <CircularProgressLoading />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {cars?.map((car, index) => (
                    <Box key={index} cursor="pointer">
                      <CarCard
                        car={car}
                        showActions={false}
                        showPassengers={true}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
            <Grid item size={8} md={5}>
              <Typography variant="h6" fontWeight="bold">
                People without rides
              </Typography>

              {passengersLoading ? (
                <CircularProgressLoading />
              ) : passengersError ? (
                <p>{passengersError}</p>
              ) : (
                passengers
                  ?.filter((person) => !person.assignedCar)
                  .map((person, index) => (
                    <Box key={index} mb={2}>
                      <PeopleWithoutRidesCard
                        person={person}
                        cars={cars}
                        handleCarChange={handleCarChange}
                      />
                    </Box>
                  ))
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Calendar;

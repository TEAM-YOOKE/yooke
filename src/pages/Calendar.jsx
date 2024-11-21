import React from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Grid2 from "@mui/material/Unstable_Grid2";
import { Box, Grid, Typography } from "@mui/material";
import CarCard from "../components/CarCard";
import { PEOPLE, RECURRING_RIDES } from "../constants";
import PeopleWithoutRidesCard from "../components/PeopleWithoutRidesCard";
const Calendar = () => {
  const [value, setValue] = React.useState(dayjs("2024-11-21"));

  const handleCarChange = (event, newValue) => {
    console.log(newValue);
  };

  return (
    <Box >
      <Grid container p={2}  spacing={8}>
        {/* Left Section */}
        <Grid item size={4}>
          <Box
            sx={{
              border: "1px solid #33bdbd",
              borderRadius: 2,
              backgroundColor: "#f0fbfb",
              boxShadow: 3,
              cursor: "pointer",
              width: "100%",
              mb: 2,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={value}
                onChange={(newValue) => setValue(newValue)}
              />
            </LocalizationProvider>
          </Box>
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
        </Grid>
        <Grid item size={8} mt={4}>
          <Typography variant="h6" fontWeight="bold">
            People without rides
          </Typography>
          {PEOPLE.map((person, index) => (
            <Box key={index} my={2}>
              <PeopleWithoutRidesCard
                person={person}
                cars={RECURRING_RIDES}
                handleCarChange={handleCarChange}
              />
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Calendar;

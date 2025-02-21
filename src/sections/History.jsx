import React from "react";
import RideHistoryCard from "../components/cards/HistoryCard";
import { Box } from "@mui/material";
import useUserTrips from "../hooks/userTrips";

const trips = [
  {
    origin: "Bawaleshi",
    destination: "37 Military Teaching Hospital",
    date: "11 Feb",
    pickUpTime: "10:00 AM",
    dropOffTime: "11:02 AM",
    duration: "1hr 2min",
    driver: {
      name: "Kwaku Manu",
      carModel: "Toyota Rav 4",
      plate: "GH-419",
    },
  },
  {
    origin: "Bawaleshi",
    destination: "37 Military Teaching Hospital",
    date: "9 Feb",
    pickUpTime: "10:08 AM",
    dropOffTime: "10:55 AM",
    duration: "55min",
    driver: {
      name: "Kwaku Manu",
      carModel: "Toyota Rav 4",
      plate: "GH-419",
    },
  },
  {
    origin: "Circle VIP Station",
    destination: "buro.",
    date: "6 Feb",
    pickUpTime: "10:05 AM",
    dropOffTime: "11:03 AM",
    duration: "58min",
    driver: {
      name: "Kwaku Manu",
      carModel: "Toyota Rav 4",
      plate: "GH-419",
    },
  },
  {
    origin: "Awoshie Market",
    destination: "37 Military Teaching Hospital",
    date: "22/12/2024",
    pickUpTime: "10:00 AM",
    dropOffTime: "11:05 AM",
    duration: "1hr 5min",
    driver: {
      name: "Kwaku Manu",
      carModel: "Toyota Rav 4",
      plate: "GH-419",
    },
  },
];

const History = () => {
  const { trips, tripsLoading, tripsError, refreshTrips } = useUserTrips();
  console.log(trips);
  return (
    <Box display="flex" flexDirection="column" gap={2} my={2}>
      {trips &&
        trips.map((trip, index) => {
          return <RideHistoryCard key={index} trip={trip} />;
        })}
    </Box>
  );
};

export default History;

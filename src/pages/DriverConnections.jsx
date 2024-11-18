import React from "react";
import { Container, Grid, Typography } from "@mui/material";
import PassengerCard from "../components/PassengerCard";

const dummyData = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    whatsapp: "+237 677009988",
    pickup: "Carrefour Obili",
    dropoff: "Carrefour Bastos",
    seats: 5,
    avatar: "path/to/avatar.jpg", // replace with the actual path to avatar image
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    whatsapp: "+237 699001122",
    pickup: "Carrefour Essos",
    dropoff: "Carrefour Tsinga",
    seats: 5,
    avatar: "path/to/avatar.jpg", // replace with the actual path to avatar image
  },
  // Add more dummy data as needed
];

const DriverConnections = () => {
  return (
    <Container>
      <Typography
        variant="h6"
        sx={{
          paddingTop: "47px",
          textAlign: "left",
          marginLeft: 2,
          marginBottom: "10px",
        }}
      >
        Connections
      </Typography>
      <Grid container spacing={3}>
        {dummyData.map((passenger, index) => (
          <Grid item xs={12} md={6} lg={4} key={index} sx={{}}>
            <PassengerCard {...passenger} />
          </Grid>
        ))}
      </Grid>
      <div style={{ height: "16px" }} />
    </Container>
  );
};

export default DriverConnections;

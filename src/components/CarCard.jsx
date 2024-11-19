import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

const CarCard = ({ car }) => {
  const { plate, model, driverName, driverPhone } = car; // Destructure card data

  return (
    <Card
      sx={{
        border: "1px solid #33bdbd",
        borderRadius: 2,
        backgroundColor: "#f0fbfb",
        boxShadow: 3,
        padding: 1,

        // margin: "auto",
        // "&:hover": {
        //   boxShadow: 5,
        //   transform: "scale(1.02)",
        // },
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant="body1" fontWeight="bold">
            Plate
          </Typography>
          <Typography variant="body2">{plate}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1" fontWeight="bold">
            Driver Name
          </Typography>
          <Typography variant="body2">{driverName}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1" fontWeight="bold">
            Model
          </Typography>
          <Typography variant="body2">{model}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1" fontWeight="bold">
            Driver Phone
          </Typography>
          <Typography variant="body2">{driverPhone}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CarCard;

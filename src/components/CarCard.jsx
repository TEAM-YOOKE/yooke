import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  IconButton,
  Badge,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CarCard = ({
  car,
  handleDeleteCar,
  handleClickOpenCarForm,
  handleCloseAccountForm,
  showActions = true,
  showPassengers = false,
}) => {
  const { plate, model, driverName, driverPhone, passengers } = car; // Destructure card data
  console.log("car--->", car);

  return (
    <Card
      sx={{
        border: "1px solid #33bdbd",
        borderRadius: 2,
        bgcolor: "transparent",
        boxShadow: 3,
        padding: 1,
        cursor: "default",
        my: 1,
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
      }}
    >
      <Grid container columnSpacing={4} rowSpacing={2}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Badge
                badgeContent={`${
                  4 - car.passengers.length === 0
                    ? "full"
                    : 4 - car.passengers.length + "slots"
                } `}
                color="secondary"
              >
                <Typography variant="h6" fontWeight="bold">
                  {plate}
                </Typography>
              </Badge>
            </Box>

            {showActions && (
              <Box display="flex" gap={2} alignItems="center">
                <IconButton
                  onClick={() => handleClickOpenCarForm(car)}
                  aria-label="edit"
                  color="primary"
                  size="small"
                >
                  <EditIcon sx={{ fontSize: "medium" }} />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteCar(car.id)}
                  aria-label="delete"
                  color="error"
                >
                  <DeleteIcon sx={{ fontSize: "medium" }} />
                </IconButton>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item>
          <Typography variant="body2">Model: </Typography>
          <Typography variant="body2" fontWeight="bold">
            {model}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2">Driver Name: </Typography>
          <Typography variant="body2" fontWeight="bold">
            {driverName}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2">Driver Phone: </Typography>
          <Typography variant="body2" fontWeight="bold">
            {driverPhone}
          </Typography>
        </Grid>

        {showPassengers && (
          <Grid item>
            <Typography variant="body2">Passengers: </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {passengers && passengers.length ? (
                passengers.map((passenger, index) => {
                  return (
                    <Typography
                      component="span"
                      variant="body2"
                      fontWeight="bold"
                      key={index}
                      mr={1}
                    >
                      {passenger},
                    </Typography>
                  );
                })
              ) : (
                <Typography variant="body2" fontWeight="bold">
                  No Passengers
                </Typography>
              )}
            </Box>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

export default CarCard;

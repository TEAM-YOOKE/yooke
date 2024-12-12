import React, { useState } from "react";
import { Box, Button, Typography, TextField, Chip, Grid } from "@mui/material";
import CarCard from "../components/CarCard";
import RefreshIcon from "@mui/icons-material/Refresh";
import Autocomplete from "@mui/material/Autocomplete";
import {
  query,
  collection,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import CircularProgressLoading from "../components/feedbacks/CircularProgressLoading";
import CarForm from "../components/dialogs/CarForm";
import useCars from "../hooks/cars";
import usePassengers from "../hooks/passengers";
import selectRide from "../assets/images/select_ride.svg";

const RecurringRides = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [openCarForm, setOpenCarForm] = useState(false);

  const { cars, refreshCars, carsLoading } = useCars();
  const { passengers, passengersLoading, refreshPassengers } = usePassengers();

  const handleCarSelect = (car) => {
    setSelectedCar(car);
  };

  const handleAddPersonToCar = async (e) => {
    e.preventDefault();
    if (!selectedCar || !selectedPerson) {
      console.error("Both car and person must be selected");
      return;
    }

    try {
      setAddLoading(true);
      const carQuery = query(
        collection(db, "cars"),
        where("plate", "==", selectedCar.plate)
      );
      const carSnapshot = await getDocs(carQuery);

      if (!carSnapshot.empty) {
        const carDoc = carSnapshot.docs[0];
        const carDocRef = doc(db, "cars", carDoc.id);
        const carData = carDoc.data();

        const updatedPassengers = [
          ...(carData.passengers || []),
          selectedPerson,
        ];
        await updateDoc(carDocRef, { passengers: updatedPassengers });
      } else {
        console.error("Car not found");
        return;
      }

      const personQuery = query(
        collection(db, "accounts"),
        where("email", "==", selectedPerson.email)
      );
      const personSnapshot = await getDocs(personQuery);

      if (!personSnapshot.empty) {
        const personDoc = personSnapshot.docs[0];
        const personDocRef = doc(db, "accounts", personDoc.id);
        await updateDoc(personDocRef, { assignedCar: true });
      } else {
        console.error("Person not found");
        return;
      }

      setSelectedPerson((prev) => null);

      refreshCars();
      refreshPassengers();
      setSelectedCar((prev) => ({
        ...prev,
        passengers: [...prev.passengers, selectedPerson],
      }));
    } catch (error) {
      console.error("Error adding person to car:", error);
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemovePassengerFromCar = async (passenger) => {
    if (
      !window.confirm(
        `Are you sure you want to remove "${
          passenger.username || passenger.email
        }" from car?`
      )
    )
      return;
    if (!selectedCar || !passenger) {
      console.error("Car and passenger must be selected");
      return;
    }

    try {
      setAddLoading(true);

      const personQuery = query(
        collection(db, "accounts"),
        where("email", "==", passenger.email)
      );
      const personSnapshot = await getDocs(personQuery);

      if (!personSnapshot.empty) {
        const personDoc = personSnapshot.docs[0];
        const personDocRef = doc(db, "accounts", personDoc.id);
        await updateDoc(personDocRef, { assignedCar: false });
      } else {
        console.error("Passenger not found");
        return;
      }

      const carQuery = query(
        collection(db, "cars"),
        where("plate", "==", selectedCar.plate)
      );
      const carSnapshot = await getDocs(carQuery);

      if (!carSnapshot.empty) {
        const carDoc = carSnapshot.docs[0];
        const carDocRef = doc(db, "cars", carDoc.id);
        const carData = carDoc.data();

        const updatedPassengers = carData.passengers.filter(
          (p) => p.email !== passenger.email
        );
        await updateDoc(carDocRef, { passengers: updatedPassengers });
      } else {
        console.error("Car not found");
        return;
      }
      setSelectedCar((prev) => {
        const newPassengers = prev.passengers.filter(
          (p) => p.email !== passenger.email
        );
        return { ...prev, passengers: newPassengers };
      });
      refreshPassengers();
      refreshCars();
    } catch (error) {
      console.error("Error removing passenger from car:", error);
    } finally {
      setAddLoading(false);
    }
  };

  const handleOpenCarForm = () => {
    setOpenCarForm(true);
  };

  const handleCloseCarForm = () => {
    setOpenCarForm(false);
  };

  return (
    <Grid container p={2}>
      <Grid item md={7} size={4}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            onClick={handleOpenCarForm}
            sx={{ textTransform: "none", borderRadius: 9 }}
          >
            Add new car
          </Button>
          <Button
            onClick={() => {
              refreshCars();
              refreshPassengers();
            }}
            variant="outlined"
          >
            <RefreshIcon />
          </Button>
        </Box>

        {carsLoading ? (
          <CircularProgressLoading />
        ) : (
          cars?.map((car, index) => (
            <Box
              key={index}
              borderRadius={2}
              bgcolor={selectedCar?.plate === car.plate ? "#c4e7e7" : ""}
              onClick={() => handleCarSelect(car)}
            >
              <CarCard car={car} showActions={false} showPassengers={true} />
            </Box>
          ))
        )}
      </Grid>

      <Grid
        md={5}
        item
        p={8}
        sx={{ position: "fixed", width: "100%", right: 0 }}
      >
        {!selectedCar ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 2,
              textAlign: "center",
              color: "gray",
            }}
          >
            <Typography variant="h6">
              <b>No car selected</b>
            </Typography>
            <Typography>Select a car to add passengers to the ride.</Typography>
            <Box
              component="img"
              src={selectRide}
              alt="No Car"
              sx={{ width: "50%", opacity: 0.8 }}
            />
          </Box>
        ) : (
          <>
            <Box component="form" onSubmit={handleAddPersonToCar}>
              {selectedCar ? (
                <Typography variant="h6">
                  Rides for car with model: <b>{selectedCar.model}</b> and
                  driver <b>{selectedCar.driverName}</b>
                </Typography>
              ) : (
                <Typography variant="h6">
                  Select a car to add a person
                </Typography>
              )}

              <Box sx={{ display: "flex", gap: 2 }}>
                <Autocomplete
                  disabled={!selectedCar || selectedCar.passengers?.length >= 4}
                  options={passengers?.filter((p) => !p.assignedCar) ?? []}
                  getOptionLabel={(option) =>
                    `${option.username || option.email} - ${
                      option.pickUpLocation || ""
                    }`
                  }
                  onChange={(event, newValue) => setSelectedPerson(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Person" />
                  )}
                  value={selectedPerson} // Bind value to the selectedPerson state
                  sx={{ flexGrow: 2 }}
                />

                <Button
                  variant="contained"
                  type="submit"
                  disabled={addLoading}
                  sx={{ textTransform: "none", borderRadius: 9, flexGrow: 0.5 }}
                >
                  {addLoading ? "Adding..." : "Add to this ride"}
                </Button>
              </Box>
            </Box>

            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}
            >
              {selectedCar?.passengers?.map((passenger, index) => (
                <Box>
                  <Chip
                    key={index}
                    label={passenger.username || passenger.email}
                    onDelete={() => handleRemovePassengerFromCar(passenger)}
                    sx={{
                      backgroundColor: "#e9f5f9",
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </>
        )}
      </Grid>

      <CarForm open={openCarForm} handleClose={handleCloseCarForm} />
    </Grid>
  );
};

export default RecurringRides;

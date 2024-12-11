import React, { useEffect, useState } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";
import CarForm from "../components/dialogs/CarForm";
import CircularProgressLoading from "../components/feedbacks/CircularProgressLoading";
import useCars from "../hooks/cars";
import usePassengers from "../hooks/passengers";

const RecurringRides = () => {
  const [selectedCar, setSelectedCar] = useState({});
  const [selectedPerson, setSelectedPerson] = useState({});
  // const [passengersLoading, setPassengersLoading] = useState(false);
  // const [passengers, setPassengers] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [openCarForm, setOpenCarForm] = useState(false);

  const { cars, refreshCars, carsLoading, carsError } = useCars();
  const { passengers, passengersLoading, refreshPassengers, passengersError } =
    usePassengers();

  console.log("assengers", passengers);

  const handleCarSelect = (car) => {
    console.log(car);
    setSelectedCar(car);
  };

  const handleAddPersonToCar = async (e) => {
    e.preventDefault();
    console.log(selectedCar);
    console.log(selectedPerson);

    try {
      setAddLoading(true);
      // Fetch the car document and update its passengers array
      const q = query(
        collection(db, "cars"),
        where("plate", "==", selectedCar.plate)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const carDoc = querySnapshot.docs[0];
        const carDocRef = doc(db, "cars", carDoc.id); // Get the document reference
        const carData = carDoc.data();

        console.log("carData before update", carData);

        // Add the selectedPerson email to the passengers field
        const updatedPassengers = [
          ...(carData.passengers || []),
          selectedPerson.username || selectedPerson.email,
        ];
        await updateDoc(carDocRef, { passengers: updatedPassengers }); // Update the document

        console.log("Car passengers updated successfully");
      } else {
        console.error("Car not found");
      }

      // Fetch the person document and update the assignedCar field
      const personQ = query(
        collection(db, "accounts"),
        where("email", "==", selectedPerson.email)
      );
      const personQuerySnapshot = await getDocs(personQ);

      if (!personQuerySnapshot.empty) {
        const personDoc = personQuerySnapshot.docs[0];
        const personDocRef = doc(db, "accounts", personDoc.id); // Get the document reference

        await updateDoc(personDocRef, { assignedCar: true }); // Update the document

        console.log("Person assignedCar field updated successfully");
      } else {
        console.error("Person not found");
      }
      setSelectedPerson({});
      refreshCars();
      refreshPassengers();
    } catch (error) {
      console.error("Error adding person to car:", error);
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemovePassengerFromCar = async (email) => {
    try {
      setAddLoading(true);
      const personQ = query(
        collection(db, "accounts"),
        where("email", "==", email)
      );
      const personQuerySnapshot = await getDocs(personQ);

      if (!personQuerySnapshot.empty) {
        const personDoc = personQuerySnapshot.docs[0];
        const personDocRef = doc(db, "accounts", personDoc.id);
        await updateDoc(personDocRef, { assignedCar: false });

        console.log("Person assignedCar field updated successfully");
      } else {
        console.error("Person not found");
      }
    } catch (error) {
      console.error("Error adding person to car:", error);
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
      {/* Left Section */}
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
            type="button"
            sx={{
              height: "47px",
              textTransform: "none",
              boxShadow: "none",
              borderRadius: "9px",
              marginY: 1,
            }}
            onClick={handleOpenCarForm}
          >
            Add new car
          </Button>
          <Button
            onClick={() => {
              refreshPassengers();
              refreshCars();
            }}
            variant="outlined"
            color="primary"
            size="small"
            aria-label="Refresh cars"
          >
            <RefreshIcon />
          </Button>
        </Box>
        {carsLoading ? (
          <CircularProgressLoading />
        ) : (
          <Box>
            {cars?.map((car, index) => (
              <Box
                key={index}
                cursor="pointer"
                onClick={() => handleCarSelect(car)}
                borderRadius={2}
                bgcolor={selectedCar.plate === car.plate ? "#c4e7e7" : ""}
              >
                <CarCard car={car} showActions={false} showPassengers={true} />
              </Box>
            ))}
          </Box>
        )}
      </Grid>

      {/* Right Section */}
      <Grid md={5} item p={8} sx={{ position: "fixed", right: 0 }}>
        <Box component="form" onSubmit={handleAddPersonToCar}>
          {selectedCar && selectedCar.plate ? (
            <Typography variant="h6">
              Rides for car with model: <b>{selectedCar.model}</b> and driver{" "}
              <b>{selectedCar.driverName}</b>
            </Typography>
          ) : (
            <Typography variant="h6">Select a car to add a person</Typography>
          )}

          <Box sx={{ display: "flex", gap: 4 }}>
            <Autocomplete
              disabled={
                !selectedCar.plate || selectedCar.passengers?.length >= 4
              }
              disablePortal
              options={
                passengers?.filter((passenger) => !passenger.assignedCar) ?? []
              }
              getOptionLabel={(option) =>
                (option.username || option.email) +
                " - " +
                (option?.pickUpLocation || "")
              }
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
              disabled={addLoading}
            >
              {addLoading ? "Adding..." : "Add to this ride"}
            </Button>
          </Box>
        </Box>

        {/* Selected People */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // flexWrap: "wrap",
            gap: 1,
          }}
        >
          {selectedCar?.passengers?.map((passenger, index) => (
            <Box>
              <Chip
                key={index}
                label={passenger}
                onDelete={() => handleRemovePassengerFromCar(passenger)}
                sx={{
                  textAlign: "left",
                  backgroundColor: "#e9f5f9",
                  color: "#333",
                  fontWeight: "bold",
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Additional Information */}
        <Typography variant="body1">
          Who is going where? Name + place they are going
        </Typography>
      </Grid>
      <CarForm open={openCarForm} handleClose={handleCloseCarForm} />
    </Grid>
  );
};

export default RecurringRides;

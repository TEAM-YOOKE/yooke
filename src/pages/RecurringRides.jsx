import React, { useEffect, useState } from "react";
import { Box, Button, Typography, TextField, Chip, Grid } from "@mui/material";
import CarCard from "../components/CarCard";
import { PEOPLE, RECURRING_RIDES } from "../constants";
import Grid2 from "@mui/material/Unstable_Grid2";
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

const RecurringRides = () => {
  const [selectedCar, setSelectedCar] = useState({});
  const [selectedPerson, setSelectedPerson] = useState({});
  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [passengersLoading, setPassengersLoading] = useState(false);
  const [passengers, setPassengers] = useState([]);
  const [addLoading, setAddLoading] = useState(false);

  const fetchPassengers = async () => {
    try {
      setPassengersLoading(true);
      const q = query(collection(db, "accounts"));

      // fetch passengers with accountType == Passenger
      const querySnapshot = await getDocs(
        q,
        where("accountType", "===", "Passenger")
      );
      const passengersData = querySnapshot.docs.map((doc) => doc.data());
      console.log("passengersData", passengersData);

      setPassengers(
        passengersData.filter(
          (passenger) => passenger.accountType === "Passenger"
        )
      );
      return passengersData;
    } catch (error) {
      console.log("Error fetching passengers", error);
    } finally {
      setPassengersLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      setCarsLoading(true);
      const q = query(collection(db, "cars"));
      const querySnapshot = await getDocs(q);
      const carsData = querySnapshot.docs.map((doc) => doc.data());
      setCars(carsData);
      console.log(carsData);
    } catch (error) {
      console.log("Error fetching cars", error);
    } finally {
      setCarsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchPassengers();
  }, []);

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
          selectedPerson.email,
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

      fetchCars();
      fetchPassengers();
    } catch (error) {
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <Grid container p={2}>
      {/* Left Section */}
      <Grid item size={4}>
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
        {carsLoading ? (
          <CircularProgress />
        ) : (
          <Box>
            {cars.map((car, index) => (
              <Box
                key={index}
                cursor="pointer"
                onClick={() => handleCarSelect(car)}
                borderRadius={2}
                bgcolor={
                  selectedCar.plate === car.plate ? "#33bdbd" : "#f0fbfb"
                }
              >
                <CarCard car={car} />
              </Box>
            ))}
          </Box>
        )}
      </Grid>

      {/* Right Section */}
      <Grid p={8}>
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
              options={passengers ?? []}
              getOptionLabel={(option) => option.email}
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
              label={passenger.email}
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
    </Grid>
  );
};

export default RecurringRides;

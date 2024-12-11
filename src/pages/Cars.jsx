import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import CarCard from "../components/CarCard";
import { db } from "../firebase-config";
import {
  addDoc,
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import RefreshIcon from "@mui/icons-material/Refresh";

function Cars() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    id: "",
    plate: "",
    model: "",
    driverName: "",
    driverPhone: "",
    passengers: [],
  });
  const [carsLoading, setCarsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCars = async () => {
    try {
      setCarsLoading(true);
      const q = query(collection(db, "cars"));
      const querySnapshot = await getDocs(q);
      const carsData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Include document ID
        ...doc.data(),
      }));
      setCars(carsData);
    } catch (error) {
      console.log("Error fetching cars", error);
    } finally {
      setCarsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const { plate, model, driverName, driverPhone } = form;
    if (!plate || !model || !driverName || !driverPhone) {
      setError("All fields are required.");
      return false;
    }
    setError("");
    return true;
  };

  const handleAddCar = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newCar = { ...form, createdAt: new Date() };
      const docRef = await addDoc(collection(db, "cars"), newCar);
      setCars([...cars, { id: docRef.id, ...newCar }]);
      setForm({
        id: "",
        plate: "",
        model: "",
        driverName: "",
        driverPhone: "",
      });
    } catch (err) {
      setError("Failed to add car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCar = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const carDocRef = doc(db, "cars", form.id);
      const updatedCar = { ...form };
      await updateDoc(carDocRef, updatedCar);
      setCars(cars.map((car) => (car.id === form.id ? updatedCar : car)));
      setForm({
        id: "",
        plate: "",
        model: "",
        driverName: "",
        driverPhone: "",
      });
    } catch (err) {
      setError("Failed to update car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (carId) => {
    try {
      setLoading(true);
      const carDocRef = doc(db, "cars", carId);
      await deleteDoc(carDocRef);
      setCars(cars.filter((car) => car.id !== carId));
    } catch (err) {
      setError("Failed to delete car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedCar = (car) => {
    setForm(car); // Populate form with selected car data
  };

  const buttonStyles = {
    backgroundColor: "#001023",
    color: "#fff",
    "&:hover": { backgroundColor: "#333" },
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={8}>
        {/* List of Cars */}
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Available Cars</Typography>
            <Button
              onClick={fetchCars}
              variant="outlined"
              color="primary"
              size="small"
              sx={{ mt: 2 }}
              aria-label="Refresh cars"
            >
              <RefreshIcon />
            </Button>
          </Box>
          {carsLoading ? (
            <CircularProgress size={24} />
          ) : cars && cars.length ? (
            cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                handleClick={() => handleSelectedCar(car)}
                handleEdit={() => handleEditCar(car)}
                handleDelete={() => handleDeleteCar(car.id)}
              />
            ))
          ) : (
            <Typography variant="body2">No cars available</Typography>
          )}
        </Grid>

        {/* Add/Edit Car Form */}
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" mb={2}>
              {form.id ? "Edit Car" : "Add a New Car"}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap={2}>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <TextField
              label="Plate"
              variant="outlined"
              name="plate"
              value={form.plate}
              onChange={handleInputChange}
              aria-label="Car plate"
            />
            <TextField
              label="Model"
              variant="outlined"
              name="model"
              value={form.model}
              onChange={handleInputChange}
              aria-label="Car model"
            />
            <TextField
              label="Driver Name"
              variant="outlined"
              name="driverName"
              value={form.driverName}
              onChange={handleInputChange}
              aria-label="Driver name"
            />
            <TextField
              label="Driver Phone"
              variant="outlined"
              name="driverPhone"
              value={form.driverPhone}
              onChange={handleInputChange}
              aria-label="Driver phone number"
            />
            <Button
              variant="contained"
              onClick={form.id ? handleEditCar : handleAddCar}
              sx={buttonStyles}
              disabled={loading}
              aria-label={form.id ? "Edit car" : "Add car"}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : form.id ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Cars;

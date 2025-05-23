import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Snackbar,
  Grid,
  Autocomplete,
} from "@mui/material";
import { db, functions } from "../../firebase-config";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import useCars from "../../hooks/cars";
import { httpsCallable } from "firebase/functions";

const CarForm = ({ open, handleClose, car }) => {
  const [formData, setFormData] = useState({
    plate: "",
    model: "",
    driverName: "",
    driverPhone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { refreshCars } = useCars();

  const [drivers, setDrivers] = useState([]);

  // Fetch drivers with accountType === "Car owner"
  // const fetchDrivers = async () => {
  //   try {
  //     const q = query(
  //       collection(db, "accounts"),
  //       where("accountType", "==", "Car owner")
  //     );
  //     const querySnapshot = await getDocs(q);
  //     const driversData = querySnapshot.docs.map((doc) => doc.data());
  //     setDrivers(driversData);
  //   } catch (error) {
  //     console.error("Error fetching drivers:", error);
  //     setSnackbar({
  //       open: true,
  //       message: "Failed to load drivers. Please try again.",
  //       severity: "error",
  //     });
  //   }
  // };

  // useEffect(() => {
  //   fetchDrivers();
  // }, []);

  // Populate form data for editing
  useEffect(() => {
    if (car) {
      setFormData({
        plate: car.plate || "",
        model: car.model || "",
        driverName: car.driverName || "",
        driverPhone: car.driverPhone || "",
      });
    } else {
      setFormData({
        plate: "",
        model: "",
        driverName: "",
        driverPhone: "",
      });
    }
  }, [car]);

  const validateField = (name, value) => {
    const validators = {
      plate: (val) => /^[A-Z]{3}-[0-9]{4}$/.test(val) || "Invalid plate format",
      model: (val) => val.trim() !== "" || "Model is required",
      driverName: (val) => val.trim() !== "" || "Driver name is required",
      driverPhone: (val) =>
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(val) ||
        "Invalid phone number format",
    };
    return validators[name] ? validators[name](value) : true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // const handleDriverSelect = (event, value) => {
  //   if (value) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       driverName: value.name,
  //       driverPhone: value.phone,
  //     }));
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       driverName: "",
  //       driverPhone: "",
  //     }));
  //   }
  // };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const validationResult = validateField(key, formData[key]);
      if (validationResult !== true) {
        newErrors[key] = validationResult;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const checkPlateExists = async (data) => {
  //   const q = query(
  //     collection(db, "cars"),
  //     where("plate", "==", formData.plate)
  //   );
  //   const querySnapshot = await getDocs(q);
  //   if (!querySnapshot.empty) {
  //     setSnackbar({
  //       open: true,
  //       message: "Car with the same plate already exists",
  //       severity: "error",
  //     });
  //     setLoading(false);
  //     return;
  //   }
  // };

  const createCar = httpsCallable(functions, "createCar");
  const updateCar = httpsCallable(functions, "updateCar");

  const handleCreateOrUpdateCar = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      let result;
      if (car) {
        // result = await updateCar({
        //   ...formData,
        // });
        console.log("car to update -->", car);
      } else {
        result = await createCar({
          ...formData,
          passengers: [],
          createdAt: new Date(),
        });
      }

      console.log(car ? "updated car" : "added car", "--->", result.data);
      handleClose();
      refreshCars();
    } catch (error) {
      console.log(
        car ? "Error updating car" : "Error creating car",
        "--->",
        error
      );
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{car ? "Update Car" : "Create New Car"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} py={1}>
            <Grid item xs={12}>
              <TextField
                label="Plate"
                variant="outlined"
                name="plate"
                value={formData.plate}
                onChange={handleChange}
                error={!!errors.plate}
                helperText={errors.plate}
                fullWidth
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Model"
                variant="outlined"
                name="model"
                value={formData.model}
                onChange={handleChange}
                error={!!errors.model}
                helperText={errors.model}
                fullWidth
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              {/* <Autocomplete
                defaultValue={(car && car.driverName) || null}
                options={drivers}
                getOptionLabel={(option) => option.name}
                onChange={handleDriverSelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Driver Name"
                    variant="outlined"
                    error={!!errors.driverName}
                    helperText={errors.driverName}
                    fullWidth
                  />
                )}
                disabled={loading}
              /> */}
              <TextField
                label="Driver Name"
                variant="outlined"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                error={!!errors.driverName}
                helperText={errors.driverName}
                fullWidth
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Driver Phone"
                variant="outlined"
                name="driverPhone"
                value={formData.driverPhone}
                onChange={handleChange}
                error={!!errors.driverPhone}
                helperText={errors.driverPhone}
                disabled={loading}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateOrUpdateCar}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : car ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CarForm;

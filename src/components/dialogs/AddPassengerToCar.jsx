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
import { db } from "../../firebase-config";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  query,
  getDocs,
  where,
} from "firebase/firestore";

const AddPassengerToCar = ({ open, handleClose, car }) => {
  /**
   * A form to add or update a car
   *
   * @param {{ open: boolean, handleClose: Function, car: Object }} props
   * @returns {React.ReactElement}
   */
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

  const [drivers, setDrivers] = useState([]);

  // Fetch drivers with accountType === "Car owner"
  /**
   * Fetches drivers with accountType === "Car owner"
   * @returns {Promise<void>}
   */
  const fetchDrivers = async () => {
    try {
      const q = query(
        collection(db, "accounts"),
        where("accountType", "==", "Car owner")
      );
      const querySnapshot = await getDocs(q);
      const driversData = querySnapshot.docs.map((doc) => doc.data());
      setDrivers(driversData);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setSnackbar({
        open: true,
        message: "Failed to load drivers. Please try again.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    /**
     * Validates a field and returns an error message if invalid
     * @param {string} name The name of the field to validate
     * @param {string} value The value of the field to validate
     * @returns {string|true} The error message if invalid, or true if valid
     */
    fetchDrivers();
  }, []);

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
    /**
     * Handles a change in the form data
     * @param {React.ChangeEvent<HTMLInputElement>} e The change event
     */
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDriverSelect = (event, value) => {
    /**
     * Handles a change in the selected driver
     * @param {React.ChangeEvent<HTMLElement>} event The change event
     * @param {Object} value The selected driver
     */
    if (value) {
      setFormData((prev) => ({
        ...prev,
        driverName: value.name,
        driverPhone: value.phone,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        driverName: "",
        driverPhone: "",
      }));
    }
  };

  const validateForm = () => {
    /**
     * Validates the entire form and returns an object with error messages
     * @returns {Object} An object with error messages for each invalid field
     */
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

  const handleSubmit = async () => {
    /**
     * Handles the form submission
     */
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (car) {
        // Update existing car
        const carDoc = doc(db, "cars", car.id);
        await updateDoc(carDoc, { ...formData, updatedAt: new Date() });
        setSnackbar({
          open: true,
          message: "Car details updated successfully",
          severity: "success",
        });
      } else {
        // Add new car
        await addDoc(collection(db, "cars"), {
          ...formData,
          passengers: [],
          createdAt: new Date(),
        });
        setSnackbar({
          open: true,
          message: "Car created successfully",
          severity: "success",
        });
      }
      handleClose();
    } catch (error) {
      console.error("Failed to save car", error);
      setSnackbar({
        open: true,
        message: "Failed to save car. Please try again.",
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
        <DialogContent></DialogContent>
        <DialogActions></DialogActions>
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

export default AddPassengerToCar;

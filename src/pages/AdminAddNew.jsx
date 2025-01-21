import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { db, auth } from "../firebase-config";
import { addDoc, collection, doc, updateDoc, getDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

import useAccounts from "../hooks/accounts";

const AdminAddNew = ({ open, handleClose, user }) => {
  const [formData, setFormData] = useState({
    email: "",
    company: "",
    accountType: "Car owner",
    username: "",
    whatsappNumber: "",
    pickUpLocation: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { refreshAccounts } = useAccounts();

  useEffect(() => {
    // Populate form fields when editing

    if (user) {
      console.log(user);
      setFormData({
        email: user.email || "",
        company: user.company || "",
        accountType: user.accountType || "Car owner",
        username: user.username || "",
        whatsappNumber: user.whatsappNumber || "",
        pickUpLocation: user.pickUpLocation || "",
      });
    } else {
      setFormData({
        email: "",
        company: "",
        accountType: "Car owner",
        username: "",
        whatsappNumber: "",
        pickUpLocation: "",
      });
    }
  }, [user]);

  const validateField = (name, value) => {
    const validators = {
      email: (val) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val) ||
        "Invalid email format",
      // add username, whatsappnumber and pickuplocation validators
      company: (val) => val.trim() !== "" || "Company name is required",
    };
    return validators[name] ? validators[name](value) : true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

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

  const generatePassword = () => {
    const chars =
      process.env.REACT_APP_PASSWORD_SECRETE ||
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 8 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const apiKey = process.env.REACT_APP_apiKey;
    // console.log(process.env.REACT_APP_FIREBASE_API_KEY);
    // return;
    try {
      if (user) {
        // Update existing user
        const userDoc = doc(db, "accounts", user.id); // Assumes `user` contains a Firestore document ID
        await updateDoc(userDoc, { ...formData, updatedAt: new Date() });
        setSnackbar({
          open: true,
          message: `Account details updated successfully`,
          severity: "success",
        });
      } else {
        const initialPassword = generatePassword();

        // const userCredential = await createUserWithEmailAndPassword(
        //   auth,
        //   formData.email,
        //   initialPassword
        // );

        // // Log the original user back in
        // await signOut(auth);
        // await signInWithEmailAndPassword(currentUserEmail, currentUserPassword);

        // Create user using Firebase REST API
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              password: initialPassword,
              returnSecureToken: false, // Prevent login
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.log(apiKey);
          throw new Error(errorData.error.message || "Failed to create user");
        }

        await addDoc(collection(db, "accounts"), {
          ...formData,
          initialPassword,
          createdAt: new Date(),
          assignedCar: null,
          pickUpLocation: null,
        });
        setSnackbar({
          open: true,
          message: `Account created successfully with initial password: ${initialPassword}`,
          severity: "success",
        });
      }

      setFormData({
        email: "",
        company: "",
        accountType: "Car owner",
        username: "",
        whatsappNumber: "",
        pickUpLocation: "",
      });

      await refreshAccounts();
      handleClose();
    } catch (error) {
      console.error("Failed to create account", error);
      setSnackbar({
        open: true,
        message: user
          ? `Failed to update account: ${error.message}`
          : `Failed to create account: ${error.message}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const formFields = user
    ? ["username", "email", "whatsappNumber", "pickUpLocation", "company"]
    : ["email", "company"];
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {user ? "Update Account" : "Create New Account"}
        </DialogTitle>
        <DialogContent>
          {formFields.map((field) => (
            <TextField
              key={field}
              margin="dense"
              label={
                field === "company"
                  ? "Company Name"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              type={field}
              name={field}
              fullWidth
              value={formData[field]}
              onChange={handleChange}
              error={!!errors[field]}
              helperText={errors[field]}
              disabled={loading}
            />
          ))}
          <RadioGroup
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
          >
            {["Car owner", "Passenger"].map((type) => (
              <FormControlLabel
                key={type}
                value={type}
                control={<Radio />}
                label={type}
                disabled={loading}
              />
            ))}
          </RadioGroup>
          <Alert severity="info" sx={{ mt: 2 }}>
            An initial password will be generated automatically.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : user ? (
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
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminAddNew;

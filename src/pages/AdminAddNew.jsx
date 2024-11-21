import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import { db, auth } from "../firebase-config"; // Import db and auth from your config
import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";

const AdminAddNew = ({ open, handleClose }) => {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [accountType, setAccountType] = useState("Car owner");
  const [emailError, setEmailError] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const generatePassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const passwordLength = 8;
    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  };

  const handleSubmit = async () => {
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (company.trim() === "") {
      setCompanyError("Company name is required");
      isValid = false;
    } else {
      setCompanyError("");
    }

    if (isValid) {
      setLoading(true);
      const initialPassword = generatePassword();
      try {
        // Create the user with the default auth instance
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          initialPassword
        );

        // Add the new user to the Firestore database
        await addDoc(collection(db, "accounts"), {
          email,
          company,
          accountType,
          initialPassword,
          createdAt: new Date(),
          assignedCar: null,
          pickUpLocation: null
        });

        // Sign out the new user after the Firestore write completes
        await signOut(auth);

        setSnackbarMessage(
          "Account created successfully with initial password: " +
            initialPassword
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Reset form state
        setEmail("");
        setCompany("");
        setAccountType("Car owner");
        handleClose();
      } catch (error) {
        console.error("Failed to create account", error);
        setSnackbarMessage("Failed to create account: " + error.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Account</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Name of Company"
            type="text"
            fullWidth
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            error={!!companyError}
            helperText={companyError}
            disabled={loading}
          />
          <RadioGroup
            aria-label="account-type"
            name="account-type"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          >
            <FormControlLabel
              value="Car owner"
              control={<Radio />}
              label="Car owner"
              disabled={loading}
            />
            <FormControlLabel
              value="Passenger"
              control={<Radio />}
              label="Passenger"
              disabled={loading}
            />
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
            {loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminAddNew;

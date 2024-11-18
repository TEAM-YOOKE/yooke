import React, { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import dayjs from "dayjs";
import { useAuth } from "../helpers/GeneralContext";

const colors = [
  { r: 255, g: 59, b: 48 }, // Red
  { r: 255, g: 149, b: 0 }, // Orange
  { r: 255, g: 204, b: 0 }, // Yellow
  { r: 52, g: 199, b: 89 }, // Green
  { r: 0, g: 199, b: 190 }, // Light Blue
  { r: 48, g: 176, b: 199 }, // Sky Blue
  { r: 50, g: 173, b: 230 }, // Blue
  { r: 0, g: 122, b: 255 }, // Dark Blue
  { r: 88, g: 86, b: 214 }, // Purple
  { r: 175, g: 82, b: 222 }, // Violet
  { r: 255, g: 45, b: 85 }, // Bright Red
  { r: 162, g: 132, b: 94 }, // Brown
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const FinishSetupPassenger = () => {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(currentUser?.username || "");
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser?.whatsappNumber || "");
  const [leaveTime, setLeaveTime] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const profileColor = getRandomColor();

    try {
      if (currentUser && currentUser.docId) {
        console.log("Updating document for user docId:", currentUser.docId);
        const userDocRef = doc(db, "accounts", currentUser.docId);
        await updateDoc(userDocRef, {
          username,
          whatsappNumber,
          leaveTime: leaveTime.toISOString(),
          accountSetupDone: true,
          profileColor,
        });

        await updateUser(currentUser.email);
        navigate("/app");
      } else {
        throw new Error("User document ID is missing");
      }
    } catch (error) {
      console.error("Error finishing setup:", error);
      setError("Failed to finish account setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <Typography variant="h4" component="h1">
        Welcome to Yooke, {currentUser.email}
      </Typography>
      <Typography variant="body1" sx={{ marginTop: "16px" }}>
        Please fill this form to finish setting up your account.
      </Typography>

      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ my: 2 }}
      />
      <TextField
        label="WhatsApp Number (with country code, no spaces)"
        variant="outlined"
        fullWidth
        required
        value={whatsappNumber}
        onChange={(e) => setWhatsappNumber(e.target.value)}
        helperText="Please enter your number in the format: 15551234567"
        sx={{ my: 2 }}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Time you usually leave the house"
          value={leaveTime}
          onChange={(newValue) => setLeaveTime(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth />}
          sx={{ my: 2 }}
        />
      </LocalizationProvider>

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        color="primary"
        variant="contained"
        disableElevation
        fullWidth
        type="submit"
        disabled={loading}
        sx={{
          height: "47px",
          textTransform: "none",
          boxShadow: "none",
          borderRadius: "9px",
          marginTop: "16px",
        }}
      >
        {loading ? "Submitting..." : "Finish Setup"}
      </Button>
    </Box>
  );
};

export default FinishSetupPassenger;

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Grid,
  Alert,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import dayjs from "dayjs";
import StopPoints from "../components/StopPoints";
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

const FinishSetupDriver = () => {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(currentUser?.username || "");
  const [whatsappNumber, setWhatsappNumber] = useState(
    currentUser?.whatsappNumber || ""
  );
  const [leaveTime, setLeaveTime] = useState(dayjs());
  const [carName, setCarName] = useState("");
  const [carImages, setCarImages] = useState([]);
  const [stopPoints, setStopPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setCarImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (carImages.length < 3) {
      setError("Please upload at least 3 images of your car.");
      return;
    }
    setLoading(true);
    const storage = getStorage();
    const imageUrls = [];
    const profileColor = getRandomColor();

    try {
      // Upload images to Firebase Storage and get download URLs
      for (const file of carImages) {
        const storageRef = ref(
          storage,
          `car-images/${currentUser.uid}/${file.name}`
        );
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        imageUrls.push(downloadURL);
      }

      // Update Firestore document in accounts collection
      const userDocRef = doc(db, "accounts", currentUser.docId);
      await updateDoc(userDocRef, {
        username,
        whatsappNumber,
        carImages: imageUrls,
        accountSetupDone: true,
        profileColor,
      });

      // Create a new document in the rides collection
      await addDoc(collection(db, "rides"), {
        driverName: username,
        driverId: currentUser.uid,
        acceptingRideRequests: true,
        leaveTime: leaveTime.toISOString(),
        carName,
        stopPoints, // Stop points from the StopPoints component
      });

      await updateUser(currentUser.email);
      navigate("/app");
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
      <h1 className="h1">Welcome to Yooke, {currentUser.email}</h1>
      <p className="body1" style={{ marginTop: "16px" }}>
        Please fill this form to finish setting up your account.
      </p>

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

      <TextField
        label="What car do you drive?"
        variant="outlined"
        fullWidth
        required
        value={carName}
        onChange={(e) => setCarName(e.target.value)}
        sx={{ margin: "16px 0 32px 0" }}
      />

      <StopPoints
        value={stopPoints}
        onChange={(newValue) => setStopPoints(newValue)}
      />

      <Alert severity="info" sx={{ mt: 2 }}>
        Please insert stop points along your way where you can pick people up.
        For example, if you live in A and work at D but pass through B and C
        while going to work, your stop points are A, B, C, and D.
      </Alert>

      <Box sx={{ my: 2 }}>
        <Button
          variant="contained"
          component="label"
          disableElevation
          sx={{ borderRadius: "9px" }}
        >
          Upload Car Images
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleFileUpload}
          />
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {carImages.length > 0 && (
        <Box sx={{ mt: 2, width: "100%" }}>
          <Typography variant="h6">Preview:</Typography>
          <Grid container spacing={2}>
            {carImages.map((image, index) => (
              <Grid item key={index}>
                <Avatar
                  src={URL.createObjectURL(image)}
                  variant="rounded"
                  sx={{ width: 100, height: 100 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
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

export default FinishSetupDriver;

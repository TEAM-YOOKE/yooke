import React, { useContext, useState } from "react";
import {
  AppBar,
  IconButton,
  Typography,
  Box,
  Button,
  Alert,
  Card,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";
import { useParams, useNavigate } from "react-router-dom";
import { AvailableRoutesContext } from "../helpers/AvailableRoutesContext";
import { db } from "../firebase-config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { LanguageContext } from "../helpers/LanguageContext";

export default function YourPath() {
  const { rideId, seats, searchTime } = useParams();
  const { cachedSearches } = useContext(AvailableRoutesContext);
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const selectedRoute = Object.values(cachedSearches)
    .flat()
    .find((route) => route.id === rideId);

  if (!selectedRoute) {
    return (
      <Box>
        <Typography>{language.yourPath.noRouteFound}</Typography>
      </Box>
    );
  }

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formattedLeaveTime = formatTime(selectedRoute.leaveTime);
  const formattedSearchTime = formatTime(searchTime);

  // Correctly handle the conditional logic
  const seatsText =
    seats === "1"
      ? `${seats} ${language.yourPath.seatToBeReserved}`
      : `${seats} ${language.yourPath.seatsToBeReserved}`;

  const handleSendRequest = async () => {
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      // Check if a connection request already exists
      const notificationsRef = collection(db, "notifications");
      const q = query(
        notificationsRef,
        where("senderId", "==", user.uid),
        where("receiverId", "==", selectedRoute.driverId),
        where("type", "==", "connectionRequest")
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setSnackbarMessage(language.yourPath.connectionRequestExists);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }

      // Add a new notification document
      await addDoc(collection(db, "notifications"), {
        senderId: user.uid, // Firebase UID of the authenticated user
        senderEmail: user.email, // Email of the authenticated user
        receiverId: selectedRoute.driverId, // Firebase UID of the driver
        type: "connectionRequest",
        time: new Date(),
        readStatus: false,
        seats: seats,
      });

      setSnackbarMessage(language.yourPath.connectionRequestSent);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Redirect to app after showing success message
      setTimeout(() => {
        navigate("/app");
      }, 2000);
    } catch (error) {
      console.error("Error sending request: ", error);
      setSnackbarMessage(language.yourPath.connectionRequestError);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <AppBar
        sx={{
          position: "relative",
          background: "#fff",
          color: "#000",
          boxShadow: "none",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Box sx={{ position: "absolute", left: "16px", top: "4px" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate(-1)}
              aria-label="close"
            >
              <ArrowBackIosIcon />
            </IconButton>
          </Box>
          <Box>
            <Typography
              sx={{ textAlign: "center", marginTop: "8px" }}
              variant="h6"
              component="div"
            >
              {language.yourPath.rideDetails}
            </Typography>
          </Box>
        </Box>
      </AppBar>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          marginLeft: "12px",
          marginTop: "32px",
        }}
      >
        <ScheduleOutlinedIcon sx={{ fontSize: "19px", marginRight: "10px" }} />
        <div>{formattedSearchTime}</div>
      </Box>
      <Box
        sx={{
          display: "grid",
          borderBottom: "1px solid #C4C4C4",
          gridTemplateColumns: "40px 1fr 1fr",
          padding: "10px 0 20px 0",
          borderRadius: "6px",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateRows: "16px 14px 16px",
            marginLeft: "12px",
          }}
        >
          <Box
            sx={{
              width: "16px",
              height: "16px",
              border: "4px solid #39B54A",
              borderRadius: "16px",
            }}
          ></Box>
          <Box
            sx={{ borderLeft: "1px dashed #C4C4C4", marginLeft: "8px" }}
          ></Box>
          <Box
            sx={{
              width: "16px",
              height: "16px",
              border: "4px solid #FF0000",
              borderRadius: "16px",
            }}
          ></Box>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateRows: "1fr 1fr",
            "& > div": { display: "flex", color: "rgba(0, 0, 0, .7)" },
          }}
        >
          <Box sx={{}}>
            <Box sx={{ position: "relative", top: "-3px" }}>
              {selectedRoute.stopPoints[0]}
            </Box>
          </Box>
          <Box sx={{}}>
            <Box sx={{ position: "relative", top: "2.5px" }}>
              {selectedRoute.stopPoints[selectedRoute.stopPoints.length - 1]}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          marginLeft: "12px",
          marginTop: "16px",
        }}
      >
        <ScheduleOutlinedIcon sx={{ fontSize: "19px", marginRight: "10px" }} />
        <div>{formattedLeaveTime}</div>
      </Box>
      <Box sx={{ padding: "0 16px 16px 16px" }}>
        <Alert severity="info" sx={{ mt: 2 }}>
          {language.yourPath.departureTimeInfo}
        </Alert>
      </Box>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          marginLeft: "12px",
          marginTop: "19px",
        }}
      >
        <EventSeatOutlinedIcon sx={{ fontSize: "19px", marginRight: "10px" }} />
        <div>{seatsText}</div>
      </Box>

      {/* Driver Card */}
      <Card
        sx={{
          boxShadow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: 2,
          margin: "16px",
          width: "calc(100% - 32px)",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">{selectedRoute.driverName}</Typography>
          <Typography variant="subtitle1">{selectedRoute.carName}</Typography>
          {selectedRoute.carImages && selectedRoute.carImages.length > 0 && (
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr 1fr"
              gap="4px"
              mt={2}
            >
              {selectedRoute.carImages.map((image, index) => (
                <img
                  src={image}
                  alt={`Car ${index + 1}`}
                  key={index}
                  style={{ width: "100%", height: "auto" }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Card>

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          width: "100vw",
          padding: "22px 24px",
          boxShadow: "24",
        }}
      >
        <Button
          disableElevation
          variant="contained"
          fullWidth
          type="submit"
          sx={{
            height: "47px",
            textTransform: "none",
            boxShadow: "none",
            borderRadius: "9px",
          }}
          onClick={handleSendRequest}
          disabled={loading}
        >
          {loading ? (
            <>
              <CircularProgress size={24} sx={{ color: "#fff", mr: 2 }} />
              {language.yourPath.sendingRequest}
            </>
          ) : (
            language.yourPath.sendRequest
          )}
        </Button>
      </Box>
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
    </Box>
  );
}

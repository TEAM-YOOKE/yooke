import React, { useEffect } from "react";
import { Box, Button, AppBar, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";

import { LanguageContext } from "../../helpers/LanguageContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import { auth, db } from "../../firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import GoogleMapSearch from "../inputs/GoogleMapSearch";
import { useAuth } from "../../helpers/GeneralContext";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import useRides from "../../hooks/rides";
import useCurrentUserDoc from "../../hooks/currentUserDoc";

const PassengerHomeNav = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  const [pickupPoint, setPickupPoint] = useState("");
  const [dropOffPoint, setDropOffPoint] = useState("");
  const [departureTime, setDepartureTime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [car, setCar] = useState(null);
  const [carLoading, setCarLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    currentUserDoc: currentUser,
    currentUserDocLoading,
    refreshCurrentUserDoc,
    rideData,
    rideDataLoading,
    refreshRideData,
  } = useCurrentUserDoc();

  const handlePickUpChange = (e) => {
    setPickupPoint(e.target.value);
  };

  const handleUpdateLocation = async () => {
    try {
      setLoading(true);
      const personQ = query(
        collection(db, "accounts"),
        where("email", "==", auth.currentUser.email)
      );
      const personQuerySnapshot = await getDocs(personQ);

      if (!personQuerySnapshot.empty) {
        const personDoc = personQuerySnapshot.docs[0];
        const personDocRef = doc(db, "accounts", personDoc.id);
        await updateDoc(personDocRef, {
          pickUpLocation: searchValue?.structured_formatting?.main_text,
        });
        console.log("location updated");
        setSnackbar({
          open: true,
          message: "Location updated",
          severity: "success",
        });
        refreshCurrentUserDoc();
        setSearchValue("");
      } else {
        console.log("person not found");
      }
    } catch (error) {
      console.log("error updating location", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AppBar
      position="sticky"
      sx={{ bgcolor: "#fff" }}
      color="inherit"
      elevation={1}
    >
      <Box
        display="flex"
        alignItems="left"
        textAlign="left"
        flexDirection="column"
        padding="15px"
        gap={3}
        justifyContent="space-between"
      >
        <Box display="flex" flexDirection="column">
          <Typography component="small" fontSize={"12px"}>
            Pick up location{" "}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{ fontSize: "12px" }}
          >
            <GoogleMapSearch value={searchValue} setValue={setSearchValue} />

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateLocation}
              disabled={loading}
              sx={{ borderRadius: "10px", height: "100%" }}
            >
              {loading ? "Updating..." : "Submit"}
            </Button>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography component="span" fontSize={"12px"} color={"#22CEA6"}>
              <LocationOnIcon fontSize="small" />
            </Typography>
            <Typography component="span" fontWeight={"bold"} fontSize={"12px"}>
              {currentUser?.pickUpLocation ?? "Not set"}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography component="span" fontSize={"12px"} color={"#22CEA6"}>
              <AccessTimeIcon fontSize="small" />
            </Typography>
            <Typography component="span" fontWeight={"bold"} fontSize={"12px"}>
              {currentUser?.leaveTime
                ? new Date(currentUser.leaveTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Not set"}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography component="span" fontSize={"12px"} color={"#22CEA6"}>
              <DirectionsCarIcon fontSize="small" />
            </Typography>
            <Typography component="span" fontSize={"12px"} fontWeight={"bold"}>
              {rideDataLoading ? (
                <CircularProgress size={15} />
              ) : rideData ? (
                rideData.car.name + " - " + (rideData.car.plate || "N/A")
              ) : (
                "Not paired"
              )}
            </Typography>
          </Box>
        </Box>
      </Box>
    </AppBar>
  );
};

export default PassengerHomeNav;

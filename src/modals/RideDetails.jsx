import React, { useState, useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import {
  Alert,
  AppBar,
  Avatar,
  Button,
  Card,
  CircularProgress,
  Icon,
  IconButton,
  Snackbar,
  Toolbar,
  Typography,
  Zoom,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import ToysIcon from "@mui/icons-material/Toys";
import CircularProgressLoading from "../components/feedbacks/CircularProgressLoading";
import RideTrackingMap from "../components/inputs/RideTrackingMap";
import useCurrentUserDoc from "../hooks/currentUserDoc";
import { handleOpenWhastApp } from "../helpers/helperFunctions";
import RideTrackingMap2 from "../components/inputs/RideTrackingMap2";
import {
  arrayRemove,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import RideTrackingMap3 from "../components/inputs/RideTrackingMap3";
import useUserTrips from "../hooks/userTrips";

const style = {
  position: "absolute",
  top: 0,
  height: "70%",
  overflowY: "scroll",
  width: "100%",
  bgcolor: "#EFF3F6",
  boxShadow: 24,
  boxSizing: "border-box",
  background: "transparent",
};

var render = function (status) {
  if (status === Status.LOADING)
    return (
      <Box display="flex" justifyContent="center">
        <Typography>
          <CircularProgress thickness={4} />
        </Typography>
      </Box>
    );
  if (status === Status.FAILURE)
    return (
      <Box display="flex" justifyContent="center">
        <Typography variant="body2">Unable to load map...</Typography>
      </Box>
    );

  return null;
};

const RideDetails = (props) => {
  const {
    currentUserDoc: currentUser,
    currentUserDocLoading,
    rideData,
    rideDataLoading,
  } = useCurrentUserDoc();
  const { refreshTrips } = useUserTrips();
  const [loading, setLoading] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [calculatedDistance, setCalculatedDistance] = useState(0);
  const [tripId, setTripId] = useState(null);
  const [cancelTripLoading, setCancelTRipLoading] = useState(false);
  const [inCar, setInCar] = useState(false);
  const containerRef = React.useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCancelTrip = async () => {
    if (!window.confirm("Are you sure you want to cancel this trip?")) return;

    setCancelTRipLoading(true);
    try {
      // First, check if there's an ongoing trip for this ride
      const tripsRef = collection(db, "trips");
      let tripToCancel = null;

      // If we have a stored tripId, use it directly
      if (tripId) {
        tripToCancel = tripId;
      } else {
        // Otherwise, query for the active trip
        const q = query(
          tripsRef,
          where("passengerId", "==", currentUser?.id),
          where("rideId", "==", rideData?.id),
          where("status", "==", "ongoing")
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          tripToCancel = querySnapshot.docs[0].id;
        }
      }

      // If we found an ongoing trip, update it to cancelled
      if (tripToCancel) {
        const tripRef = doc(db, "trips", tripToCancel);
        await updateDoc(tripRef, {
          status: "cancelled",
          endedAt: serverTimestamp(),
        });

        // Reset the inCar state
        setInCar(false);
        setTripId(null);
      }

      // Always update the ride document to remove the user
      const rideRef = doc(db, "rides", rideData.id);
      await updateDoc(rideRef, {
        going: arrayRemove(currentUser.id),
      });

      // Update trip history with real-time listener
      refreshTrips();

      props.onClose();

      setSnackbar({
        open: true,
        message: "Trip canceled",
        severity: "success",
      });
    } catch (error) {
      console.error("Error canceling trip:", error);
      setSnackbar({
        open: true,
        message: "Failed to cancel trip",
        severity: "error",
      });
    } finally {
      setCancelTRipLoading(false);
    }
  };

  const handleGetInCar = async () => {
    if (!window.confirm("Are you sure you want to get in the car?")) return;

    setLoading(true);
    try {
      const tripData = {
        rideId: rideData?.id || "",
        passengerId: currentUser?.id || "",
        driverId: rideData?.driverId || "",
        status: "ongoing",
        startedAt: serverTimestamp(),
        endedAt: null,
        pickUpLocation: currentUser?.pickUpLocation || {},
        dropOffLocation: null,
        driverInfo: {
          name: rideData?.driverData?.username || "",
          phoneNumber: rideData?.driverData?.whatsappNumber || "",
          carModel: rideData?.car?.name || "",
          carPlate: rideData?.car?.plate || "",
        },
      };

      // Create a new trip document in Firestore
      const tripRef = await addDoc(collection(db, "trips"), tripData);
      // Store the trip ID for later use
      setTripId(tripRef.id);
      setInCar(true);

      setSnackbar({
        open: true,
        message: "Trip started successfully",
        severity: "success",
      });
    } catch (error) {
      console.log("Error Getting in car:", error);
      setSnackbar({
        open: true,
        message: "Error starting trip",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetOutCar = async () => {
    if (!window.confirm("Are you sure you want to end this trip?")) return;

    setLoading(true);
    try {
      // Get current location for drop-off
      let dropOffLocation = null;
      let formattedAddress = "Destination";

      if (navigator.geolocation) {
        // Get current position for drop-off location
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;

              // Create location object
              dropOffLocation = {
                lat: latitude,
                lng: longitude,
              };

              // Try to get address from coordinates using geocoder
              const geocoder = new window.google.maps.Geocoder();
              try {
                const response = await new Promise((resolve, reject) => {
                  geocoder.geocode(
                    { location: { lat: latitude, lng: longitude } },
                    (results, status) => {
                      if (status === "OK" && results[0]) {
                        resolve(results[0]);
                      } else {
                        reject(new Error("Geocoding failed"));
                      }
                    }
                  );
                });

                // Store formatted address separately
                formattedAddress = response.formatted_address;

                // Create address object structure similar to pickUpLocation
                dropOffLocation.address = {
                  description: formattedAddress,
                  structured_formatting: {
                    main_text: formattedAddress.split(",")[0],
                    secondary_text: formattedAddress
                      .split(",")
                      .slice(1)
                      .join(",")
                      .trim(),
                  },
                };
              } catch (error) {
                console.log("Error getting address:", error);
                // Create a default address structure if geocoding fails
                dropOffLocation.address = {
                  description: "Destination",
                  structured_formatting: {
                    main_text: "Destination",
                    secondary_text: "",
                  },
                };
              }

              resolve();
            },
            (error) => {
              console.error("Error getting current position:", error);
              reject(error);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        });
      }

      // Find the active trip for this passenger and ride
      let tripToUpdate;

      if (tripId) {
        // If we have the trip ID stored, use it directly
        tripToUpdate = tripId;
      } else {
        // Otherwise, query for the active trip
        const tripsRef = collection(db, "trips");
        const q = query(
          tripsRef,
          where("passengerId", "==", currentUser?.id),
          where("rideId", "==", rideData?.id),
          where("status", "==", "ongoing")
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          tripToUpdate = querySnapshot.docs[0].id;
        } else {
          throw new Error("No active trip found");
        }
      }

      // Calculate trip duration
      const tripRef = doc(db, "trips", tripToUpdate);
      const tripDoc = await getDoc(tripRef);

      if (tripDoc.exists()) {
        const tripData = tripDoc.data();
        const startTime = tripData.startedAt.toDate();
        const endTime = new Date();
        const durationMs = endTime - startTime;

        // Format duration as string (e.g., "45 min" or "1 hr 15 min")
        const minutes = Math.floor(durationMs / 60000);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        let durationText = "";
        if (hours > 0) {
          durationText = `${hours} hr${
            hours > 1 ? "s" : ""
          } ${remainingMinutes} min`;
        } else {
          durationText = `${minutes} min`;
        }

        // Update the trip document
        await updateDoc(tripRef, {
          status: "completed",
          endedAt: serverTimestamp(),
          dropOffLocation: formattedAddress, // Store only the formatted address string
          dropOffLocationData: dropOffLocation, // Store the full location object separately
          duration: durationText,
        });

        // If this ride has a ride document, update its state as well
        if (rideData?.id) {
          const rideRef = doc(db, "rides", rideData.id);
          await updateDoc(rideRef, {
            rideStarted: false,
          });
        }
      }

      // Reset states
      setInCar(false);
      setTripId(null);

      // Update trip history with real-time listener
      refreshTrips();

      setSnackbar({
        open: true,
        message: "Trip completed successfully",
        severity: "success",
      });

      // Close the modal after successful completion
      setTimeout(() => {
        props.onClose();
      }, 1500);
    } catch (error) {
      console.log("Error getting out of car:", error);
      setSnackbar({
        open: true,
        message: "Error completing trip: " + error.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal
        closeAfterTransition={true}
        open={props.open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Zoom
          container={containerRef.current}
          appear={true}
          in={props.open}
          direction="left"
          mountOnEnter
          unmountOnExit
          //   timeout={300}
        >
          <Box
            sx={{
              background: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(5.8px)",
              WebkitBackdropFilter: "blur(5.8px)",
              width: "100%",
              height: "100vh",
            }}
          >
            <Box sx={style}>
              {/* <Card
                sx={{
                  position: "fixed",
                  borderRadius: "20px",
                  left: "50%",
                  transform: "translateX(-55%)",
                  top: "3%",
                  zIndex: 5,
                  bgcolor: "#fff",
                  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                  width: "80%",
                  padding: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",

                    fontSize: "11px",
                  }}
                >
                  
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      borderBottom: "1px solid #E0E0E0", // Border for separation
                      paddingY: "8px",
                    }}
                  >
                    <ToysIcon fontSize="small" sx={{ color: "#33bdbd" }} />
                    <Typography fontSize="13px" sx={{ fontWeight: 500 }}>
                      {rideData?.stopPoints[0]}
                    </Typography>
                  </Box>

                  
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      paddingY: "8px",
                    }}
                  >
                    <LocationOnIcon fontSize="small" sx={{ color: "red" }} />
                    <Typography fontSize="13px" sx={{ fontWeight: 500 }}>
                      {
                        currentUser?.pickUpLocation?.address
                          ?.structured_formatting?.main_text
                      }
                    </Typography>
                  </Box>
                </Box>
              </Card> */}

              <IconButton
                sx={{
                  position: "fixed",
                  right: "2%",
                  top: "2%",
                  zIndex: 5,
                  bgcolor: "#fff",
                  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.2)",
                  },
                  fontSize: "small",
                }}
                onClick={() => {
                  props.onClose();
                }}
              >
                <CloseIcon sx={{ color: "#000" }} fontSize="small" />
              </IconButton>
              <Wrapper
                render={render}
                apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              >
                <RideTrackingMap3
                  setEstimatedTime={setEstimatedTime}
                  setCalculatedDistance={setCalculatedDistance}
                  rideData={rideData}
                  currentUser={currentUser}
                />
              </Wrapper>
              <Box borderTopRightRadius="12px" borderTopLeftRadius="12px">
                <AppBar
                  position="fixed"
                  color="inherit"
                  sx={{
                    boxShadow: "4px 4px 8px 5px rgba(0, 0, 0, 0.2)",
                    top: "auto",
                    bottom: 0,
                    p: 2,

                    width: { md: "60%" },
                    left: { md: "20%" },
                    borderTopRightRadius: "20px",
                    borderTopLeftRadius: "20px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        justifyContent: "center",
                        borderBottom: "1px solid #E0E0E0",
                        pb: 1,
                      }}
                    >
                      <Typography variant="h6" textAlign="center">
                        <strong>
                          {rideData?.rideStarted
                            ? "Driver is  heading to your location..."
                            : "Not Started"}
                        </strong>
                      </Typography>
                      {estimatedTime && calculatedDistance ? (
                        <Typography variant="body1" textAlign="center">
                          Estimated Time: <strong>{estimatedTime}</strong>
                        </Typography>
                      ) : (
                        ""
                      )}{" "}
                      <Typography variant="body1" textAlign="center">
                        {rideData?.car?.name} | {rideData?.car?.plate}
                      </Typography>
                    </Box>
                    {/* -------Driver Details-------- */}
                    <Grid container spacing={2} alignItems="center">
                      {/* Driver's Image or Avatar */}
                      <Grid size={3}>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {rideData?.driverData?.profilePicture ? (
                            <Avatar
                              src={rideData.driverData.profilePicture}
                              alt={rideData.driverData.username}
                              sx={{ width: 50, height: 50 }}
                            />
                          ) : (
                            <Avatar
                              sx={{
                                bgcolor: "#e0e0e0",
                                width: 50,
                                height: 50,
                              }}
                            >
                              <PersonIcon fontSize="large" />
                            </Avatar>
                          )}
                        </Box>
                      </Grid>

                      <Grid size={6}>
                        <Box>
                          <Typography>
                            <strong>
                              {rideData?.driverData?.username ||
                                "Unknown Driver"}
                            </strong>
                          </Typography>
                          <Typography
                            variant="body2"
                            fontSize="11px"
                            color="text.secondary"
                          >
                            ({rideData?.driverData?.company})
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Action Buttons */}
                      <Grid size={3}>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          gap={2}
                        >
                          <IconButton
                            sx={{
                              border: "1px solid #22CEA6",
                              padding: "5px",
                            }}
                            onClick={() => {
                              handleOpenWhastApp(rideData, currentUser);
                            }}
                          >
                            <WhatsAppIcon
                              sx={{ color: "#22CEA6" }}
                              fontSize="small"
                            />
                          </IconButton>
                          <IconButton
                            sx={{
                              border: "1px solid #22CEA6",
                              padding: "5px",
                            }}
                            onClick={() =>
                              rideData?.driverData?.whatsappNumber &&
                              window.open(
                                `tel:${rideData.driverData.whatsappNumber}`,
                                "_self"
                              )
                            }
                          >
                            <PhoneIcon
                              sx={{ color: "#22CEA6" }}
                              fontSize="small"
                            />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Button
                        color="error"
                        // variant="outlined"
                        sx={{ textTransform: "none", alignSelf: "left" }}
                        fullWidth={false}
                        onClick={handleCancelTrip}
                      >
                        Cancel Trip
                      </Button>
                      <Button
                        color="success"
                        variant="outlined"
                        sx={{
                          textTransform: "none",
                          borderRadius: "20px",
                          alignSelf: "left",
                        }}
                        fullWidth={false}
                        onClick={inCar ? handleGetOutCar : handleGetInCar}
                        // disabled={calculatedDistance > 5}
                        disabled={loading}
                      >
                        {inCar ? "Get Out" : "Get In"}
                      </Button>
                    </Box>
                  </Box>
                </AppBar>
              </Box>
              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() =>
                  setSnackbar((prev) => ({ ...prev, open: false }))
                }
              >
                <Alert
                  sx={{ borderRadius: "40px" }}
                  severity={snackbar.severity}
                  onClose={() =>
                    setSnackbar((prev) => ({ ...prev, open: false }))
                  }
                >
                  {snackbar.message}
                </Alert>
              </Snackbar>
            </Box>
          </Box>
        </Zoom>
      </Modal>
    </div>
  );
};

export default RideDetails;

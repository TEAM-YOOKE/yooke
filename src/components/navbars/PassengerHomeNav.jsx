import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Box,
  Button,
  AppBar,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  IconButton,
  Toolbar,
  Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { LanguageContext } from "../../helpers/LanguageContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import { auth, db } from "../../firebase-config";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  arrayRemove,
} from "firebase/firestore";
import GoogleMapSearch from "../inputs/GoogleMapSearch";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import useCurrentUserDoc from "../../hooks/currentUserDoc";
import SetAddress from "../../modals/SetAddress";
import EastIcon from "@mui/icons-material/East";
import EditIcon from "@mui/icons-material/Edit";
import RideDetails from "../../modals/RideDetails";

const PassengerHomeNav = () => {
  const { language } = useContext(LanguageContext);
  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  const [leaveTime, setLeaveTime] = useState(dayjs());
  const [leaveTimeLoading, setLeaveTimeLoading] = useState(false);
  const [arrivalTime, setArrivalTime] = useState(null);
  const [openLeaveTimeModal, setOpenLeaveTimeModal] = useState(false);
  const [openSetAddress, setOpenSetAddress] = useState(false);
  const [openRideDetails, setOpenRideDetails] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (navbarRef.current) {
      console.log("nav ref", navbarRef);
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, [navbarHeight]);

  const {
    currentUserDoc: currentUser,
    currentUserDocLoading,
    refreshCurrentUserDoc,
    rideData,
    rideDataLoading,
    // refreshRideData,
  } = useCurrentUserDoc();

  useEffect(() => {
    console.log("Ride data-->", rideData);
    if (!rideData) return;
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(
          currentUser?.pickUpLocation?.pinLocation.lat,
          currentUser?.pickUpLocation?.pinLocation.lng
        ),
        // destination: new window.google.maps.LatLng(),
        destination: rideData?.stopPoints[0],
        travelMode: window.google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(Date.now() + 1000), // 1 second from now
          trafficModel: "bestguess",
        },
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          // Get the distance from the result object
          const distance = result.routes[0].legs[0].distance.text;
          const duration = Math.round(
            result.routes[0].legs[0].duration_in_traffic.value / 60
          );

          // Do something with the distance and directions
          console.log(`Duration: ${duration}`);
          const carLeaveDate = new Date(rideData?.leaveTime);
          const durationInMilliseconds = duration * 60 * 1000; // Convert minutes to milliseconds
          const updatedDate = new Date(
            carLeaveDate.getTime() + durationInMilliseconds
          ).toISOString();

          setArrivalTime(
            new Date(updatedDate).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        }
      }
    );
  }, [currentUser, rideData]);

  // const handleUpdateLocation = async () => {
  //   try {
  //     setLoading(true);
  //     const personQ = query(
  //       collection(db, "accounts"),
  //       where("email", "==", currentUser.email)
  //     );
  //     const personQuerySnapshot = await getDocs(personQ);

  //     if (!personQuerySnapshot.empty) {
  //       const personDoc = personQuerySnapshot.docs[0];
  //       const personDocRef = doc(db, "accounts", personDoc.id);
  //       const personData = personDoc.data();
  //       console.log(personData);
  //       if (personData.assignedCar) {
  //         const rideRef = doc(db, "rides", personData.assignedCar);
  //         await updateDoc(rideRef, {
  //           passengers: arrayRemove(currentUser.id),
  //         });
  //       }

  //       await updateDoc(personDocRef, {
  //         pickUpLocation: null,
  //         assignedCar: null,
  //       });

  //       console.log("location updated");
  //       setSnackbar({
  //         open: true,
  //         message: "Location updated",
  //         severity: "success",
  //       });
  //       await refreshCurrentUserDoc();
  //       await refreshRideData();
  //       setSearchValue("");
  //     } else {
  //       console.log("person not found");
  //     }
  //   } catch (error) {
  //     console.log("error updating location", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleUpdateLeaveTime = async () => {
    try {
      const leaveTimeHours = leaveTime.hour();
      const leaveTimeMinutes = leaveTime.minute();

      const rideLeaveTime = dayjs(rideData ? rideData.ride.leaveTime : null);
      const rideLeaveTimeHours = rideLeaveTime.hour();
      const rideLeaveTimeMinutes = rideLeaveTime.minute();
      console.log(rideData);
      console.log(rideLeaveTimeHours, rideLeaveTimeMinutes);
      console.log(leaveTimeHours, leaveTimeMinutes);
      if (
        leaveTimeHours < rideLeaveTimeHours ||
        (leaveTimeHours === rideLeaveTimeHours &&
          leaveTimeMinutes < rideLeaveTimeMinutes)
      ) {
        setSnackbar({
          open: true,
          message:
            "Leave time must be after the current leave time. If you want to change the leave time, please exit your current ride.",
          severity: "error",
        });
        return;
      }
      setLeaveTimeLoading(true);
      const personQ = query(
        collection(db, "accounts"),
        where("email", "==", auth.currentUser.email)
      );
      const personQuerySnapshot = await getDocs(personQ);

      if (!personQuerySnapshot.empty) {
        const personDoc = personQuerySnapshot.docs[0];
        const personDocRef = doc(db, "accounts", personDoc.id);

        await updateDoc(personDocRef, {
          leaveTime: leaveTime.toISOString(),
        });

        setSnackbar({
          open: true,
          message: "Leave time updated",
          severity: "success",
        });

        refreshCurrentUserDoc();
      } else {
        setSnackbar({
          open: true,
          message: "User not found",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating leave time",
        severity: "error",
      });
      console.error("Error updating leave time", error);
    } finally {
      setLeaveTimeLoading(false);
      setOpenLeaveTimeModal(false);
    }
  };

  return (
    <>
      <AppBar
        ref={navbarRef}
        position="fixed"
        sx={{ bgcolor: "#fff" }}
        color="inherit"
        elevation={3}
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
          {/* <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              sx={{ fontSize: "12px" }}
            >
              <GoogleMapSearch
                value={searchValue}
                setValue={setSearchValue}
                setPinLocation={setPinLocation}
              />

              <Button
                variant="contained"
                onClick={handleUpdateLocation}
                disabled={loading || !searchValue}
                sx={{ borderRadius: "20px", height: "100%" }}
              >
                {loading ? "Updating..." : "Submit"}
              </Button>
            </Box>
          </Box> */}

          {rideDataLoading ? (
            <Skeleton
              variant="rounded"
              width="100%"
              height={50}
              sx={{ borderRadius: "20px" }}
            />
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={1}
              sx={{
                border:
                  rideData?.rideStarted &&
                  rideData?.going?.includes(currentUser?.id)
                    ? "2px solid rgba(220, 230, 228, 0.74)"
                    : "2px solid #22CEA6",
                borderRadius: "20px",
              }}
              onClick={() => {
                if (
                  rideData?.rideStarted &&
                  rideData?.going?.includes(currentUser?.id)
                )
                  return;
                setOpenSetAddress(true);
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Typography
                  component="span"
                  fontSize={"12px"}
                  color={
                    rideData?.rideStarted &&
                    rideData?.going?.includes(currentUser?.id)
                      ? "rgba(220, 230, 228, 0.74)"
                      : !currentUser?.pickUpLocation
                      ? "red"
                      : "#22CEA6"
                  }
                >
                  <LocationOnIcon fontSize="large" />
                </Typography>
                <Typography
                  component="span"
                  fontWeight={"bold"}
                  fontSize={"16px"}
                  color={
                    rideData?.rideStarted &&
                    rideData?.going?.includes(currentUser?.id)
                      ? "rgba(153, 158, 157, 0.74)"
                      : !currentUser?.pickUpLocation && "red"
                  }
                >
                  {currentUser?.pickUpLocation?.address?.structured_formatting
                    ?.main_text ||
                    currentUser?.pickUpLocation ||
                    "Location Not set"}
                </Typography>
              </Box>
              <EditIcon
                sx={{
                  color:
                    rideData?.rideStarted &&
                    rideData?.going?.includes(currentUser?.id)
                      ? "rgba(220, 230, 228, 0.74)"
                      : "info.main",
                }}
                // color={
                //   rideData?.rideStarted ? "rgba(220, 230, 228, 0.74)" : "info"
                // }
              />
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid size={rideData ? 5 : 12}>
              <Box
                display="flex"
                gap={1}
                justifyContent="center"
                alignItems="center"
              >
                <Typography
                  component="span"
                  fontSize={"12px"}
                  color={"#33bdbd"}
                >
                  <DirectionsCarIcon fontSize="large" />
                </Typography>
                {rideDataLoading ? (
                  <CircularProgress size={15} />
                ) : rideData ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    // alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      component="span"
                      fontSize={"13px"}
                      fontWeight={"bold"}
                    >
                      {rideData?.car?.name || "N/A"}
                    </Typography>
                    <Typography
                      component="span"
                      fontSize={"13px"}
                      fontWeight={"bold"}
                    >
                      {rideData?.car?.plate || "N/A"}
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    component="span"
                    fontWeight={"bold"}
                    fontSize={"13px"}
                  >
                    Not paired
                  </Typography>
                )}
              </Box>
            </Grid>
            {rideData ? (
              <>
                <Grid size={5}>
                  <Box
                    // onClick={() => setOpenLeaveTimeModal(true)}
                    display="flex"
                    // flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                  >
                    <Typography
                      component="span"
                      fontSize={"12px"}
                      color={"#33bdbd"}
                    >
                      <AccessTimeIcon fontSize="large" />
                    </Typography>
                    <Typography
                      component="span"
                      fontWeight={"bold"}
                      fontSize={"13px"}
                    >
                      {arrivalTime} (EST)
                    </Typography>
                  </Box>
                </Grid>
              </>
            ) : (
              ""
            )}
          </Grid>
        </Box>
        {rideData?.rideStarted &&
          rideData?.going?.includes(currentUser?.id) && (
            <Button
              sx={{
                bgcolor: "green",

                color: "white",
                p: 1,
                display: "flex",
                justifyContent: "center",
                gap: 4,
                borderRadius: 0,
                textTransform: "none",
              }}
              onClick={() => setOpenRideDetails(true)}
            >
              Ride Started
              <EastIcon />
            </Button>
          )}
      </AppBar>
      <Toolbar
        sx={{
          height: navbarHeight,
          mb: rideData?.rideStarted ? 4 : 2,
          bgcolor: "#fff",
        }}
      />
      <Dialog
        open={openLeaveTimeModal}
        onClose={() => setOpenLeaveTimeModal(false)}
      >
        <DialogTitle>Change Leave Time</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              value={leaveTime}
              onChange={(newValue) => setLeaveTime(newValue)}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLeaveTimeModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdateLeaveTime}
            disabled={leaveTimeLoading}
          >
            {leaveTimeLoading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={8000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          sx={{ borderRadius: "40px" }}
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <SetAddress
        open={openSetAddress}
        onClose={() => setOpenSetAddress(false)}
      />
      <RideDetails
        open={openRideDetails}
        onClose={() => setOpenRideDetails(false)}
      />
    </>
  );
};

export default PassengerHomeNav;

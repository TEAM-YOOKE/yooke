import React, { useEffect } from "react";
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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useContext } from "react";
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
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import useCurrentUserDoc from "../../hooks/currentUserDoc";
import SetAddress from "../../modals/SetAddress";
import EditIcon from "@mui/icons-material/Edit";

const PassengerHomeNav = () => {
  const { language } = useContext(LanguageContext);

  const [leaveTime, setLeaveTime] = useState(dayjs());
  const [leaveTimeLoading, setLeaveTimeLoading] = useState(false);
  const [openLeaveTimeModal, setOpenLeaveTimeModal] = useState(false);
  const [openSetAddress, setOpenSetAddress] = useState(false);
  const [pinLocation, setPinLocation] = useState({});

  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
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

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={1}
            sx={{
              border: "1.5px solid rgb(68, 218, 245)",
              borderRadius: "20px",
            }}
            onClick={() => setOpenSetAddress(true)}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography
                component="span"
                fontSize={"12px"}
                color={!currentUser?.pickUpLocation ? "red" : "#22CEA6"}
              >
                <LocationOnIcon fontSize="large" />
              </Typography>
              <Typography
                component="span"
                fontWeight={"bold"}
                fontSize={"16px"}
                color={!currentUser?.pickUpLocation && "red"}
              >
                {currentUser?.pickUpLocation?.address?.structured_formatting
                  ?.main_text ||
                  currentUser?.pickUpLocation ||
                  "Location Not set"}
              </Typography>
            </Box>
            <EditIcon color="info" />
          </Box>

          <Grid container spacing={2}>
            <Grid size={6}>
              <Box
                onClick={() => setOpenLeaveTimeModal(true)}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Typography
                  component="span"
                  fontSize={"12px"}
                  color={"#22CEA6"}
                >
                  <AccessTimeIcon fontSize="small" />
                </Typography>
                <Typography
                  component="span"
                  fontWeight={"bold"}
                  fontSize={"12px"}
                >
                  {currentUser?.leaveTime
                    ? new Date(currentUser.leaveTime).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "Not set"}
                </Typography>
              </Box>
            </Grid>
            <Grid size={6}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography
                  component="span"
                  fontSize={"12px"}
                  color={"#22CEA6"}
                >
                  <DirectionsCarIcon fontSize="small" />
                </Typography>
                {rideDataLoading ? (
                  <CircularProgress size={15} />
                ) : rideData ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      component="span"
                      fontSize={"12px"}
                      fontWeight={"bold"}
                    >
                      {rideData.car.name}
                    </Typography>
                    <Typography
                      component="span"
                      fontSize={"12px"}
                      fontWeight={"bold"}
                    >
                      {rideData.car.plate || "N/A"}
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    component="span"
                    fontWeight={"bold"}
                    fontSize={"12px"}
                  >
                    Not paired
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </AppBar>
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
    </>
  );
};

export default PassengerHomeNav;

import React, { useState, useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { db } from "../firebase-config";
import {
  Alert,
  AppBar,
  Button,
  CircularProgress,
  Icon,
  IconButton,
  Snackbar,
  Typography,
  Zoom,
} from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  arrayRemove,
} from "firebase/firestore";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import CloseIcon from "@mui/icons-material/Close";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
// import MyMapComponent from "../MyMapComponent";
import CircularProgressLoading from "../components/feedbacks/CircularProgressLoading";
import useCurrentUserDoc from "../hooks/currentUserDoc";
import GoogleMapSearch from "../components/inputs/GoogleMapSearch";
import AddressMap from "../components/inputs/AddressMap";
import useUserLocationRides from "../hooks/userLocationRides";
const style = {
  position: "absolute",
  bottom: 0,
  height: "100%",
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

const SetAddress = ({ onClose, open }) => {
  const {
    refreshCurrentUserDoc,
    // refreshRideData,
    rideData,
    currentUserDoc: currentUser,
  } = useCurrentUserDoc();
  const { rides, ridesLoading, ridesError, refreshRides } =
    useUserLocationRides();
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [address, setAddress] = useState({});
  const [pinLocation, setPinLocation] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setAddress(currentUser?.pickUpLocation?.address);
    setPinLocation(currentUser?.pickUpLocation?.pinLocation);
  }, [currentUser]);
  const handleUpdateLocation = async () => {
    console.log("Address->", address);
    console.log("PinLocation->", pinLocation);
    try {
      setLoading(true);
      const personQ = query(
        collection(db, "accounts"),
        where("email", "==", currentUser.email)
      );
      const personQuerySnapshot = await getDocs(personQ);

      if (!personQuerySnapshot.empty) {
        const personDoc = personQuerySnapshot.docs[0];
        const personDocRef = doc(db, "accounts", personDoc.id);
        const personData = personDoc.data();
        console.log(personData);
        if (personData.assignedCar) {
          const rideRef = doc(db, "rides", personData.assignedCar);
          await updateDoc(rideRef, {
            passengers: arrayRemove(currentUser.id),
          });
        }

        await updateDoc(personDocRef, {
          pickUpLocation: { address, pinLocation },
          //   pickUpLocation: searchValue?.structured_formatting?.main_text,
          assignedCar: null,
        });

        console.log("location updated");

        await refreshCurrentUserDoc();
        // await refreshRideData();
        await refreshRides();
        setSearchValue("");
        onClose();
        // setSnackbar({
        //   open: true,
        //   message: "Location updated",
        //   severity: "success",
        // });
      } else {
        console.log("person not found");
      }
    } catch (error) {
      console.log("error updating location", error);
    } finally {
      setLoading(false);
    }
  };

  const goToCurrentLocation = (map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User's current location->", { latitude, longitude });

          setPinLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by the browser");
    }
  };

  const containerRef = React.useRef(null);

  return (
    <div>
      <Modal
        closeAfterTransition={true}
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Zoom
          container={containerRef.current}
          appear={true}
          in={open}
          direction="left"
          mountOnEnter
          unmountOnExit
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
              <AppBar
                position="fixed"
                color="inherit"
                sx={{
                  boxShadow: "4px 4px 8px 5px rgba(0, 0, 0, 0.2)",
                  top: "0",
                  bottom: "auto",

                  width: { md: "60%" },
                  left: { md: "20%" },
                  borderBottomRightRadius: "12px",
                  borderBottomLeftRadius: "12px",
                }}
              >
                <Box>
                  <IconButton
                    sx={{
                      bgcolor: "#fff",
                    }}
                    onClick={() => {
                      setAddress(currentUser?.pickUpLocation?.address);
                      setPinLocation(currentUser?.pickUpLocation?.pinLocation);
                      onClose();
                    }}
                  >
                    <CloseIcon color="primary" />
                  </IconButton>
                </Box>
                <Box
                  sx={{ px: 2, pb: 2, display: "flex", alignItems: "center" }}
                >
                  <GoogleMapSearch
                    value={address}
                    setValue={setAddress}
                    setPinLocation={setPinLocation}
                  />
                </Box>
              </AppBar>

              <Wrapper
                render={render}
                apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              >
                <AddressMap
                  address={address}
                  setAddress={setAddress}
                  setAddressLoading={setAddressLoading}
                  pinLocation={pinLocation}
                  setPinLocation={setPinLocation}
                />
                {loading && <CircularProgressLoading />}
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
                    borderTopRightRadius: "12px",
                    borderTopLeftRadius: "12px",
                  }}
                >
                  <Typography my={0}>
                    {addressLoading
                      ? "Loading..."
                      : address
                      ? address.formatted_address
                      : ""}
                  </Typography>

                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: loading ? "#aaa" : "#22CEA6",
                      color: "white",
                      borderRadius: "20px",
                      fontWeight: "bold",
                    }}
                    fullWidth
                    onClick={handleUpdateLocation}
                    disabled={loading || !address}
                    size="large"
                  >
                    {loading ? "Loading..." : "Set Location"}
                  </Button>
                  <IconButton
                    sx={{
                      position: "absolute",
                      z: 99999,
                      right: 2,
                      bottom: 90,
                    }}
                    onClick={goToCurrentLocation}
                  >
                    <GpsFixedIcon color="info" fontSize="large" />
                  </IconButton>
                </AppBar>
              </Box>
            </Box>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={snackbar.open}
              autoHideDuration={8000}
              onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
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
        </Zoom>
      </Modal>
    </div>
  );
};

export default SetAddress;

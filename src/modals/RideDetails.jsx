import React, { useState, useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import {
  AppBar,
  Card,
  CircularProgress,
  Icon,
  IconButton,
  Typography,
  Zoom,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
// import OrderTrackingMap from "../OrderTrackingMap";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import ToysIcon from "@mui/icons-material/Toys";
import CircularProgressLoading from "../components/feedbacks/CircularProgressLoading";
import RideTrackingMap from "../components/inputs/RideTrackingMap";
import useCurrentUserDoc from "../hooks/currentUserDoc";
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

const RideDetails = (props) => {
  const {
    currentUserDoc: currentUser,
    currentUserDocLoading,
    rideData,
    rideDataLoading,
  } = useCurrentUserDoc();
  const [loading, setLoading] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [calculatedDistance, setCalculatedDistance] = useState(0);

  const containerRef = React.useRef(null);

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
              <Card
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
                  {/* First Stop Point */}
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

                  {/* Second Stop Point */}
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
              </Card>

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
                {/* <OrderTrackingMap
                  order={props.order}
                  lat={props.lat}
                  lng={props.lng}
                  user={props.user}
                  selectedBranch={props.selectedBranch}
                  setEstimatedTime={setEstimatedTime}
                  setCalculatedDistance={setCalculatedDistance}
                /> */}
                <RideTrackingMap
                  setEstimatedTime={setEstimatedTime}
                  setCalculatedDistance={setCalculatedDistance}
                />
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
                            {!rideData?.rideStarted
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
                        <Grid size={2}>
                          <Box>picture</Box>
                        </Grid>
                        <Grid size={7}>
                          <Box>
                            <Typography variant="body1">
                              <strong>{rideData?.driverData?.username}</strong>
                            </Typography>
                            <Typography variant="body2" fontSize="11px">
                              {rideData?.driverData?.whatsappNumber}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={2}>
                          <Box>
                            <IconButton sx={{ border: "1px solid #33bdbd" }}>
                              <PhoneIcon
                                sx={{ color: "#33bdbd" }}
                                fontSize="small"
                              />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </AppBar>
                </Box>
                {loading && <CircularProgressLoading />}
              </Wrapper>
            </Box>
          </Box>
        </Zoom>
      </Modal>
    </div>
  );
};

export default RideDetails;

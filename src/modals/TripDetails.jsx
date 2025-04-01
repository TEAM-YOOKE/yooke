import React, { useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  AppBar,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
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

const TripDetails = ({ onClose, open, trip }) => {
  const containerRef = useRef(null);

  return (
    <div>
      <Modal
        closeAfterTransition={true}
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Slide
          container={containerRef.current}
          appear={true}
          in={open}
          direction="left"
          mountOnEnter
          unmountOnExit
        >
          <Box
            sx={{
              background: "white",
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
                  top: "0",
                  bottom: "auto",
                }}
                elevation={1}
              >
                <Box display="flex" alignItems="center" gap={8}>
                  <IconButton
                    sx={{
                      bgcolor: "#fff",
                    }}
                    onClick={() => {
                      onClose();
                    }}
                  >
                    <ArrowBackIosIcon fontSize="small" color="primary" />{" "}
                    <Typography>Back</Typography>
                  </IconButton>
                  <Typography fontWeight={500} variant="h6">
                    Trip details
                  </Typography>
                </Box>
              </AppBar>
              <Toolbar />
              <Container>
                <Box mb={3}>
                  <Typography fontWeight={500} my={1}>
                    Ride details
                  </Typography>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardContent>
                      {/* Locations */}
                      <Box display="flex" flexDirection="column" pb={1}>
                        <Box display="flex" alignItems="center">
                          <TripOriginIcon
                            sx={{
                              fontSize: 15,
                              color: "green",
                              marginRight: 1,
                            }}
                          />
                          <Typography variant="body1" fontSize="14px">
                            {trip.pickUpLocation &&
                            trip.pickUpLocation.address &&
                            trip.pickUpLocation.address.structured_formatting
                              ? trip.pickUpLocation.address
                                  .structured_formatting.main_text
                              : "Pick-up location"}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            borderLeft: "1px dashed gray",
                            height: 20,
                            marginLeft: "7px",
                            marginY: "-8px",
                          }}
                        />

                        <Box display="flex" alignItems="center">
                          <TripOriginIcon
                            sx={{ fontSize: 15, color: "red", marginRight: 1 }}
                          />

                          <Typography variant="body1" fontSize="14px">
                            {trip.status === "ongoing"
                              ? "on-going"
                              : typeof trip?.dropOffLocation === "object"
                              ? trip?.dropOffLocation?.address
                                  ?.structured_formatting?.main_text ||
                                trip?.dropOffLocation?.address?.description ||
                                "Destination"
                              : trip?.dropOffLocation || "Destination"}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider
                        sx={{ my: 2, borderBottom: "1px solid #e3e3e4" }}
                      />
                      <Grid container mb={2}>
                        <Grid
                          size={6}
                          sx={{ borderRight: "1px solid #e3e3e4 " }}
                        >
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            flexDirection="column"
                            gap={1}
                          >
                            <Typography
                              variant="body2"
                              fontSize="14px"
                              fontWeight={300}
                            >
                              Date
                            </Typography>
                            <Typography
                              variant="body2"
                              fontSize="14px"
                              fontWeight={500}
                            >
                              {trip.startedAt && trip.startedAt.seconds
                                ? new Date(
                                    trip.startedAt.seconds * 1000
                                  ).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "N/A"}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={6}>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            gap={1}
                          >
                            <Typography
                              variant="body2"
                              fontSize="14px"
                              fontWeight={300}
                            >
                              Duration
                            </Typography>
                            <Typography
                              variant="body2"
                              fontSize="14px"
                              fontWeight={500}
                            >
                              {trip.status === "ongoing"
                                ? "on-going"
                                : trip.duration}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid
                          size={6}
                          sx={{ borderRight: "1px solid #e3e3e4" }}
                        >
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            flexDirection="column"
                            gap={1}
                          >
                            <Typography
                              variant="body2"
                              fontSize="14px"
                              fontWeight={300}
                            >
                              Pickup time
                            </Typography>
                            <Typography
                              variant="body2"
                              fontSize="14px"
                              fontWeight={500}
                            >
                              {trip.startedAt && trip.startedAt.seconds
                                ? new Date(
                                    trip.startedAt.seconds * 1000
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "N/A"}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={6}>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            gap={1}
                          >
                            <Typography
                              variant="body2"
                              fontSize="14px"
                              fontWeight={300}
                            >
                              Drop off time
                            </Typography>
                            <Typography
                              variant="body2 "
                              fontSize="14px"
                              fontWeight={500}
                            >
                              {trip.status === "ongoing"
                                ? "on-going"
                                : trip.endedAt && trip.endedAt.seconds
                                ? new Date(
                                    trip.endedAt.seconds * 1000
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "N/A"}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
                <Box>
                  <Typography fontWeight={500} my={1}>
                    Driver information
                  </Typography>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      mb: 3,
                    }}
                  >
                    <CardContent>
                      <Box>
                        <Typography fontSize="14px" fontWeight={500}>
                          <Typography
                            component="span"
                            fontSize="14px"
                            fontWeight={300}
                          >
                            Name:{" "}
                          </Typography>
                          {trip.driverInfo.name}
                        </Typography>
                        <Divider
                          sx={{ my: 2, borderBottom: "1px solid #e3e3e4" }}
                        />
                        <Typography fontSize="14px" fontWeight={500}>
                          <Typography
                            component="span"
                            fontSize="14px"
                            fontWeight={300}
                          >
                            Car model:{" "}
                          </Typography>
                          {trip.driverInfo.carModel}
                        </Typography>
                        <Divider
                          sx={{ my: 2, borderBottom: "1px solid #e3e3e4" }}
                        />
                        <Typography fontSize="14px" fontWeight={500}>
                          <Typography
                            component="span"
                            fontSize="14px"
                            fontWeight={300}
                          >
                            License plate:{" "}
                          </Typography>
                          {trip.driverInfo.carPlate}
                        </Typography>
                        <Divider
                          sx={{ my: 2, borderBottom: "1px solid #e3e3e4" }}
                        />
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        mt={3}
                        gap={4}
                      >
                        {" "}
                        <IconButton
                          sx={{ color: "#de5246", border: "2px solid #de5246" }}
                        >
                          <CallIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          sx={{ color: "#4d9a7b", border: "2px solid #4d9a7b" }}
                        >
                          <WhatsAppIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Container>
            </Box>
          </Box>
        </Slide>
      </Modal>
    </div>
  );
};

export default TripDetails;

import React, { useContext, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  StepConnector,
  Avatar,
  Skeleton,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/system";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { LanguageContext } from "../helpers/LanguageContext";
import PassengerConnectionsNav from "../components/navbars/PassengerConnectionsNav";
import useCurrentUserDoc from "../hooks/currentUserDoc";
import GroupsIcon from "@mui/icons-material/Groups";
import BadgeIcon from "@mui/icons-material/Badge";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import EastIcon from "@mui/icons-material/East";
import ToysIcon from "@mui/icons-material/Toys";
import RideDetails from "../modals/RideDetails";
// Custom Step Connector styling
const CustomStepConnector = styled(StepConnector)(() => ({
  "& .MuiStepConnector-line": {
    borderColor: "#33bdbd",
    marginTop: "-8px",
  },
}));
const CustomStepIcon = () => (
  <Box
    sx={{
      width: 7,
      height: 7,
      borderRadius: "50%",
      bgcolor: "#33bdbd",
      mb: 1,
    }}
  />
);

const ConnectionsPassenger = () => {
  const { language } = useContext(LanguageContext);
  const [tabValue, setTabValue] = useState(0);
  const [openRideDetails, setOpenRideDetails] = useState(false);

  const {
    currentUserDoc: currentUser,
    currentUserDocLoading,
    refreshCurrentUserDoc,
    rideData,
    rideDataLoading,
    // refreshRideData,
  } = useCurrentUserDoc();

  console.log("ride data", rideData);
  const handleOpenWhastApp = () => {
    let url = "";
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const isWhatsAppInstalled = /WhatsApp/i.test(navigator.userAgent);
      if (isWhatsAppInstalled) {
        url = `whatsapp://send?text=Hey%20${
          rideData.driverData.username
        },%20it's%20${
          currentUser.username
        },%20from%20Yooke!&phone=+233${rideData?.driverData?.whatsappNumber.slice(
          -9
        )}`;
      } else {
        const platform = /(android)/i.test(navigator.userAgent)
          ? "android"
          : "ios";
        url = `https://wa.me/?text=Hey%20${
          rideData.driverData.username
        },%20it's%20${
          currentUser.username
        },%20from%20Yooke!&phone=+233${rideData?.driverData?.whatsappNumber.slice(
          -9
        )}&app_absent=1${platform === "android" ? "&fallback_url=" : ""}${
          platform === "android"
            ? "market://details?id=com.whatsapp"
            : "https://apps.apple.com/app/id310633997"
        }`;
      }
    } else {
      url = `https://web.whatsapp.com/send?phone=+233${rideData?.driverData?.whatsappNumber.slice(
        -9
      )}&text=Hey%20${rideData.driverData.username},%20it's%20${
        currentUser.username
      },%20from%20Yooke!&phone=+233${rideData?.driverData?.whatsappNumber.slice(
        -9
      )}`;
    }
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      const appUrl = url;
      // const webUrl = webUrl;
      const appWindow = window.open(appUrl, "_blank");
      setTimeout(() => {
        if (!appWindow || appWindow.closed || appWindow.closed === undefined) {
          window.location.href = webUrl;
        }
      }, 500);
    } else {
      window.open(webUrl, "_blank");
    }
  };

  const handleOpenRideDetails = () => {
    setOpenRideDetails(true);
  };

  return (
    <Box>
      <AppBar
        position="sticky"
        color="default"
        sx={{ pt: 2, bgcolor: "white", mb: 2 }}
      >
        <Box display="flex" flexDirection="column" gap={2} mb={2}>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ fontWeight: "bold" }}
          >
            {language.connectionsPassenger.title}
          </Typography>
          <PassengerConnectionsNav value={tabValue} setValue={setTabValue} />
        </Box>
        {rideData?.rideStarted && (
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
            onClick={handleOpenRideDetails}
          >
            Ride Started
            <EastIcon />
          </Button>
        )}
      </AppBar>
      <Container>
        {tabValue === 0 ? (
          <>
            {rideDataLoading ? (
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                mt={2}
                justifyContent="center"
                alignItems="center"
              >
                {Array(3)
                  .fill(null)
                  .map((_, index) => (
                    <Skeleton
                      key={index}
                      sx={{ width: "100%", borderRadius: 2 }}
                      variant="rectangular"
                      height={180}
                    />
                  ))}
              </Box>
            ) : !rideData ? (
              <Box sx={{ textAlign: "center", marginTop: 4 }}>
                <img
                  src="/empty.png"
                  width="150px"
                  style={{ marginTop: "40px" }}
                  alt={language.connectionsPassenger.noConnectionsAlt}
                />
                <Typography sx={{ opacity: 0.6, marginTop: 2 }}>
                  {language.connectionsPassenger.noConnectionsMessage}
                </Typography>
              </Box>
            ) : (
              <Box>
                {/* Car Details Card */}
                <Card sx={{ mb: 3, p: 2, borderRadius: "12px", boxShadow: 3 }}>
                  <CardContent>
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#535353",
                      }}
                    >
                      <ToysIcon color="secondary" />
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={2}
                      >
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Typography variant="body2">
                            <strong>
                              {rideData.car.name} ({rideData.car.plate})
                            </strong>
                          </Typography>
                          <Typography variant="body2">
                            Seats:
                            <strong>
                              {" "}
                              {rideData.passengers.length}/
                              {rideData.driverData.slots}
                            </strong>
                          </Typography>{" "}
                          <Typography variant="body2">
                            Leave Time:
                            <strong>
                              {" "}
                              {new Date(rideData.leaveTime).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </strong>
                          </Typography>{" "}
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            mt: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          <CardMedia
                            component="img"
                            src={rideData.driverData.carImages[0]}
                            alt="Car image"
                            sx={{
                              width: "150px",
                              height: "80px",
                              borderRadius: "8px",
                              boxShadow: 2,
                            }}
                          />
                        </Box>
                      </Box>

                      <Stepper
                        alternativeLabel
                        connector={<CustomStepConnector />}
                        sx={{ padding: 0 }}
                      >
                        {rideData.stopPoints.map((point, index) => (
                          <Step key={index} sx={{ alignItems: "left" }}>
                            <StepLabel
                              StepIconComponent={CustomStepIcon}
                            ></StepLabel>
                            <Typography textAlign="center" fontSize="13px">
                              {point}
                            </Typography>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                    {/* Car Images */}
                  </CardContent>
                </Card>

                {/* Driver Details Card */}
                <Card sx={{ mb: 3, p: 2, borderRadius: "12px", boxShadow: 3 }}>
                  <CardContent>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#535353",
                      }}
                    >
                      <AirlineSeatReclineNormalIcon color="secondary" />{" "}
                      {/* <strong>Driver</strong> */}
                    </Typography>
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

                      {/* Driver's Details */}
                      <Grid size={7}>
                        <Box>
                          <Typography variant="body2">
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
                      <Grid size={2}>
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
                            onClick={handleOpenWhastApp}
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
                  </CardContent>
                </Card>
                <Card sx={{ mb: 3, p: 2, borderRadius: "12px", boxShadow: 3 }}>
                  <CardContent>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        color: "#535353",
                        gap: 1,
                      }}
                    >
                      <GroupsIcon color="secondary" />
                      {/* <strong>Passengers</strong> */}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={4}>
                      {rideData.passengers.map((passenger, index) => {
                        return (
                          <Box key={index} borderBottom="1px solid #E0E0E0">
                            <Typography
                              variant="body2"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <BadgeIcon
                                fontSize="11px"
                                sx={{ color: "rgb(117, 113, 113)" }}
                              />
                              <strong>{passenger.username}</strong>
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <LocationOnIcon
                                fontSize="11px"
                                sx={{ color: "rgb(117, 113, 113)" }}
                              />

                              {passenger.pickUpLocation.address.description}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}
          </>
        ) : null}
      </Container>
      <RideDetails
        open={openRideDetails}
        onClose={() => setOpenRideDetails(false)}
      />
    </Box>
  );
};

export default ConnectionsPassenger;

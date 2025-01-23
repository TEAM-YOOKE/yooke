import React, { useContext } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { LanguageContext } from "../helpers/LanguageContext";
import PassengerConnectionsNav from "../components/navbars/PassengerConnectionsNav";
import useCurrentUserDoc from "../hooks/currentUserDoc";
import GroupsIcon from "@mui/icons-material/Groups";
import BadgeIcon from "@mui/icons-material/Badge";

const ConnectionsPassenger = () => {
  const { language } = useContext(LanguageContext);

  const {
    currentUserDoc: currentUser,
    currentUserDocLoading,
    refreshCurrentUserDoc,
    rideData,
    rideDataLoading,
    refreshRideData,
  } = useCurrentUserDoc();

  return (
    <Container>
      <Typography
        variant="h4"
        textAlign="center"
        sx={{ paddingTop: "47px", paddingBottom: "20px", fontWeight: "bold" }}
      >
        {language.connectionsPassenger.title}
      </Typography>

      <Box>
        <PassengerConnectionsNav />
      </Box>

      {rideDataLoading ? (
        <Typography sx={{ opacity: 0.6, marginTop: 2 }}>Loading...</Typography>
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
          <Card sx={{ mb: 4, p: 2, borderRadius: "12px", boxShadow: 3 }}>
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <DirectionsCarIcon color="primary" /> Car Details
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Model:</strong> {rideData.car.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>No. Plate:</strong> {rideData.car.plate}
              </Typography>
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Stop Points:</strong>
                </Typography>
                {rideData.stopPoints.map((point, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{ ml: 2, opacity: 0.8 }}
                  >
                    <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                    {point}
                  </Typography>
                ))}
              </Box>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Seats:</strong>
                {rideData.passengers.length}/{rideData.driverData.slots}
              </Typography>
              {/* Car Images */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                  flexWrap: "wrap",
                }}
              >
                {rideData.driverData.carImages.map((image, index) => (
                  <CardMedia
                    key={index}
                    component="img"
                    src={image}
                    alt={`Car image ${index + 1}`}
                    sx={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "8px",
                      boxShadow: 2,
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Driver Details Card */}
          <Card sx={{ mb: 4, p: 2, borderRadius: "12px", boxShadow: 3 }}>
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <BusinessIcon color="primary" /> Driver Details
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {rideData.driverData.username}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Company:</strong> {rideData.driverData.company}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>WhatsApp:</strong> {rideData.driverData.whatsappNumber}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Leave Time:</strong>{" "}
                <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
                {new Date(rideData.driverData.leaveTime).toLocaleTimeString(
                  "en-US",
                  { hour: "2-digit", minute: "2-digit" }
                )}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton
                  href={`tel:${rideData.driverData.whatsappNumber}`}
                  sx={{
                    border: "1px solid #33bdbd",
                    borderRadius: "50%",
                    p: 1,
                  }}
                >
                  <PhoneIcon color="primary" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ mb: 4, p: 2, borderRadius: "12px", boxShadow: 3 }}>
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <GroupsIcon color="secondary" /> Passengers
              </Typography>
              <Box display="flex" flexDirection="column" gap={4}>
                {rideData.passengers.map((passenger, index) => {
                  return (
                    <Box key={index} borderBottom="1px solid #E0E0E0">
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <BadgeIcon sx={{ color: "rgb(117, 113, 113)" }} />
                        {passenger.username}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <LocationOnIcon sx={{ color: "rgb(117, 113, 113)" }} />

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
    </Container>
  );
};

export default ConnectionsPassenger;

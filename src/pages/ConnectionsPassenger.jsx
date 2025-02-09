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
import { handleOpenWhastApp } from "../helpers/helperFunctions";
import ActiveRide from "../sections/ActiveRide";
import History from "../sections/History";
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
  } = useCurrentUserDoc();

  console.log("ride data", rideData);

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
          <ActiveRide
            rideDataLoading={rideDataLoading}
            rideData={rideData}
            currentUser={currentUser}
            currentUserDocLoading={currentUserDocLoading}
            refreshCurrentUserDoc={refreshCurrentUserDoc}
          />
        ) : tabValue === 1 ? (
          <History />
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

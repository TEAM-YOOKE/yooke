import React, { useContext } from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import { useAuth } from "../helpers/GeneralContext";
import { LanguageContext } from "../helpers/LanguageContext";
import ConnectionCard from "../components/ConnectionCard";
import useCurrentUserDoc from "../hooks/currentUserDoc";

const ConnectionsPassenger = () => {
  // const { connections, currentUser } = useAuth();
  const { language } = useContext(LanguageContext);

  // const passengerConnections = connections.filter(
  //   (connection) => currentUser.accountType === "Passenger"
  // );

  const {
    currentUserDoc: currentUser,
    currentUserDocLoading,
    refreshCurrentUserDoc,
    rideData,
    rideDataLoading,
    refreshRideData,
  } = useCurrentUserDoc();

  console.log("Ride data-->", rideData);

  return (
    <Container>
      <h1
        className="h2"
        style={{
          paddingTop: "47px",
          textAlign: "center",
          paddingBottom: "20px",
        }}
      >
        {language.connectionsPassenger.title}
      </h1>
      {/* {passengerConnections.length === 0 ? (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <img
            src="/empty.png"
            width="150px"
            style={{ marginTop: "40px" }}
            alt={language.connectionsPassenger.noConnectionsAlt}
          />
          <Typography sx={{ opacity: 0.6, marginTop: 1 }}>
            {language.connectionsPassenger.noConnectionsMessage}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {passengerConnections.map((connection) => (
            <Grid item xs={12} md={6} lg={4} key={connection.id}>
              <ConnectionCard {...connection} />
            </Grid>
          ))}
        </Grid>
      )} */}
      {rideDataLoading ? (
        <Typography sx={{ opacity: 0.6, marginTop: 1 }}>Loading...</Typography>
      ) : !rideData ? (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <img
            src="/empty.png"
            width="150px"
            style={{ marginTop: "40px" }}
            alt={language.connectionsPassenger.noConnectionsAlt}
          />
          <Typography sx={{ opacity: 0.6, marginTop: 1 }}>
            {language.connectionsPassenger.noConnectionsMessage}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography sx={{ opacity: 0.8, marginTop: 1 }}>
            {rideData.car.name}
          </Typography>
          <Typography sx={{ opacity: 0.8, marginTop: 1 }}>
            {rideData.car.plate}
          </Typography>
          <Box display="flex" flexWrap="wrap">
            <Typography sx={{ opacity: 0.8, marginTop: 1 }}>
              Stop Points:{" "}
            </Typography>
            {rideData.stopPoints.map((point, index) => {
              return (
                <Box display="flex" flexWrap="wrap">
                  <Typography sx={{ opacity: 0.6, marginTop: 1 }}>
                    {point}
                  </Typography>
                  ,{" "}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
      <div style={{ height: "16px" }} />
    </Container>
  );
};

export default ConnectionsPassenger;

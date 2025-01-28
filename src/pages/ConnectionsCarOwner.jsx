import React, { useContext, useEffect, useState } from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import { useAuth } from "../helpers/GeneralContext";
import { LanguageContext } from "../helpers/LanguageContext";
import ConnectionCard from "../components/ConnectionCard";
import useCurrentUserDoc from "../hooks/currentUserDoc";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import useCurrentCarOwnerDoc from "../hooks/currentCarOwnerDoc";
import PassengerCard from "../components/cards/PassengerCard";
import CarOwnerConnectionsNav from "../components/navbars/CarOwnerConnectionsNav";

const ConnectionsCarOwner = () => {
  const { language } = useContext(LanguageContext);
  const [tabValue, setTabValue] = useState(0);

  const {
    currentCarOwnerDoc: currentUser,
    refreshCurrentCarOwnerDoc,
    rideData,
    rideDataLoading,
  } = useCurrentCarOwnerDoc();

  console.log("current user-->", currentUser);
  console.log("ride data-->", rideData);

  return (
    <Container>
      <h1
        className="h2"
        style={{
          textAlign: "center",
          padding: "20px 0",
        }}
      >
        {language.connectionsCarOwner.title}
      </h1>

      <CarOwnerConnectionsNav value={tabValue} setValue={setTabValue} />

      {tabValue === 0 ? (
        <Box>
          {rideData?.passengers.map((passenger, index) => {
            return <PassengerCard passenger={passenger} rideData={rideData} />;
          })}
        </Box>
      ) : null}
    </Container>
  );
};

export default ConnectionsCarOwner;

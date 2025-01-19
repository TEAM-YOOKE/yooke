import React, { useContext, useEffect, useState } from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import { useAuth } from "../helpers/GeneralContext";
import { LanguageContext } from "../helpers/LanguageContext";
import ConnectionCard from "../components/ConnectionCard";
import useCurrentUserDoc from "../hooks/currentUserDoc";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import useCurrentCarOwnerDoc from "../hooks/currentCarOwnerDoc";

const ConnectionsCarOwner = () => {
  // const { connections, currentUser } = useAuth();
  const { language } = useContext(LanguageContext);

  // const carOwnerConnections = connections.filter(
  //   (connection) => currentUser.accountType === "Car owner"
  // );

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
          paddingTop: "47px",
          textAlign: "center",
          paddingBottom: "20px",
        }}
      >
        {language.connectionsCarOwner.title}
      </h1>
      - Car details - Leave time - Set off point - Stop Points - Destination
      point - passengers - start and end ride buttons (conditionally shown)
      <div style={{ height: "16px" }} />
    </Container>
  );
};

export default ConnectionsCarOwner;

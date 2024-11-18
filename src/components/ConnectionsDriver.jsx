import React, { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import ConnectionCard from "../components/ConnectionCard";
import { useAuth } from "../helpers/GeneralContext";
import { db } from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";

const ConnectionsDriver = () => {
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const fetchConnections = async () => {
      if (currentUser) {
        const connectionsRef = collection(db, "connections");
        const q = query(
          connectionsRef,
          where("person1", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const connectionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setConnections(connectionsData);
      }
    };

    fetchConnections();
  }, [currentUser]);

  return (
    <Container>
      <Typography
        variant="h6"
        sx={{
          paddingTop: "47px",
          textAlign: "left",
          marginLeft: 2,
          marginBottom: "10px",
        }}
      >
        Connections
      </Typography>
      <Grid container spacing={3}>
        {connections.map((connection) => (
          <Grid item xs={12} md={6} lg={4} key={connection.id}>
            <ConnectionCard {...connection} isDriver={true} />
          </Grid>
        ))}
      </Grid>
      <div style={{ height: "16px" }} />
    </Container>
  );
};

export default ConnectionsDriver;

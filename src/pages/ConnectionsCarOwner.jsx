import React, { useContext } from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import { useAuth } from "../helpers/GeneralContext";
import { LanguageContext } from "../helpers/LanguageContext";
import ConnectionCard from "../components/ConnectionCard";

const ConnectionsCarOwner = () => {
  const { connections, currentUser } = useAuth();
  const { language } = useContext(LanguageContext);

  const carOwnerConnections = connections.filter(
    (connection) => currentUser.accountType === "Car owner"
  );

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
      {carOwnerConnections.length === 0 ? (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <img
            src="/empty.png"
            width="150px"
            style={{ marginTop: "40px" }}
            alt={language.connectionsCarOwner.noConnectionsAlt}
          />
          <Typography sx={{ opacity: 0.6, marginTop: 1 }}>
            {language.connectionsCarOwner.noConnectionsMessage}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {carOwnerConnections.map((connection) => (
            <Grid item xs={12} md={6} lg={4} key={connection.id}>
              <ConnectionCard {...connection} />
            </Grid>
          ))}
        </Grid>
      )}
      <div style={{ height: "16px" }} />
    </Container>
  );
};

export default ConnectionsCarOwner;

import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../helpers/GeneralContext";
import { LanguageContext } from "../helpers/LanguageContext";
import ConnectionsCarOwner from "./ConnectionsCarOwner";
import ConnectionsPassenger from "./ConnectionsPassenger";

export default function Connections() {
  const { currentUser, loading } = useAuth();
  const { language } = React.useContext(LanguageContext);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">{language.connections.noUserData}</Typography>
        <Typography variant="body1">
          {language.connections.contactSupportOrLogin}
        </Typography>
      </Box>
    );
  }

  if (currentUser.accountType === "Car owner") {
    return <ConnectionsCarOwner />;
  }

  if (currentUser.accountType === "Passenger") {
    return <ConnectionsPassenger />;
  }

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h6">
        {language.connections.invalidAccountType}
      </Typography>
      <Typography variant="body1">
        {language.connections.contactSupportOrLogin}
      </Typography>
    </Box>
  );
}

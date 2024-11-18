import React, { useEffect, useContext } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../helpers/GeneralContext";
import NotificationsCarOwner from "./NotificationsCarOwner";
import NotificationsPassenger from "./NotificationsPassenger";
import { useTheme } from "@mui/material/styles";
import { LanguageContext } from "../helpers/LanguageContext";

function Notifications() {
  const { currentUser, loading, markNotificationsAsRead } = useAuth();
  const { language } = useContext(LanguageContext);
  const theme = useTheme();

  useEffect(() => {
    if (currentUser) {
      markNotificationsAsRead();
    }
  }, [currentUser, markNotificationsAsRead]);

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
        <Typography variant="h6">
          {language.notifications.noUserData}
        </Typography>
        <Typography variant="body1">
          {language.notifications.contactSupportOrLogin}
        </Typography>
      </Box>
    );
  }

  if (currentUser.accountType === "Car owner") {
    return <NotificationsCarOwner />;
  }

  if (currentUser.accountType === "Passenger") {
    return <NotificationsPassenger />;
  }

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h6">
        {language.notifications.invalidAccountType}
      </Typography>
      <Typography variant="body1">
        {language.notifications.contactSupportOrLogin}
      </Typography>
    </Box>
  );
}

export default Notifications;

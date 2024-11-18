import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../helpers/GeneralContext";
import HomeCarOwner from "./HomeCarOwner";
import HomePassenger from "./HomePassenger";

function Home() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <CircularProgress />;
  }

  if (!currentUser) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Error: No user data</Typography>
        <Typography variant="body1">
          Please contact support or try logging in again.
        </Typography>
      </Box>
    );
  }

  if (currentUser.accountType === "Car owner") {
    return <HomeCarOwner />;
  }

  if (currentUser.accountType === "Passenger") {
    return <HomePassenger />;
  }

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h6">Error: Invalid account type</Typography>
      <Typography variant="body1">
        Please contact support or try logging in again.
      </Typography>
    </Box>
  );
}

export default Home;

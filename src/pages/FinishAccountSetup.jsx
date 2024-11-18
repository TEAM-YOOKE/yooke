import React, { useEffect, useState } from "react";
import { useAuth } from "../helpers/GeneralContext";
import FinishSetupDriver from "./FinishSetupDriver";
import FinishSetupPassenger from "./FinishSetupPassenger";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const FinishAccountSetup = () => {
  const { currentUser, loading } = useAuth();
  const [accountType, setAccountType] = useState(null);

  useEffect(() => {
    if (!loading && currentUser) {
      if (currentUser.accountType) {
        setAccountType(currentUser.accountType);
      } else {
        console.error(
          "User document does not exist or account type is missing"
        );
      }
    }
  }, [loading, currentUser]);

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

  if (accountType === "Car owner") {
    return <FinishSetupDriver />;
  }

  if (accountType === "Passenger") {
    return <FinishSetupPassenger />;
  }

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h6">Error: Invalid account type</Typography>
      <Typography variant="body1">
        Please contact support or try logging in again.
      </Typography>
    </Box>
  );
};

export default FinishAccountSetup;

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../helpers/GeneralContext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// ProtectedRoute ensures that a user is logged in. If not, they are redirected to /app (login page).
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // If the app is still loading (checking authentication), show a spinner.
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

  // If the user is NOT logged in, redirect them to the login page (/app).
  if (!currentUser) {
    return <Navigate to="/app" state={{ from: location }} />;
  }

  // If the user hasn't finished account setup, redirect to finish-account-setup page.
  if (
    !currentUser.accountSetupDone &&
    location.pathname !== "/finish-account-setup"
  ) {
    return <Navigate to="/finish-account-setup" />;
  }

  // If user is logged in and setup is complete, render the protected content.
  return children;
};

export default ProtectedRoute;

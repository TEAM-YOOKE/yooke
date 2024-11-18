import React, { useState } from "react";
import { useAuth } from "../helpers/GeneralContext";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      color="primary"
      variant="contained"
      disabled={loading}
    >
      {loading ? <CircularProgress size={24} /> : "Logout"}
    </Button>
  );
};

export default LogoutButton;

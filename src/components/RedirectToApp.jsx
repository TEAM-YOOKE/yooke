import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../helpers/GeneralContext";
import LoadingSpinner from "./LoadingSpinner";

const RedirectToApp = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        if (currentUser.accountSetupDone) {
          navigate("/app");
        } else {
          navigate("/finish-account-setup");
        }
      } else {
        navigate("/login");
      }
    }
  }, [currentUser, loading, navigate]);

  return <LoadingSpinner />; // Use centralized spinner
};

export default RedirectToApp;

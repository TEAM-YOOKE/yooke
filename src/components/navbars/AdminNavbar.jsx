import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useAuth } from "../../helpers/GeneralContext";
import { LanguageContext } from "../../helpers/LanguageContext";
import AdminAddNew from "../../pages/AdminAddNew";
import { Box } from "@mui/material";
import CarForm from "../dialogs/CarForm";
const AdminNavbar = ({ tabValue, handleTabChange }) => {
  const [loading, setLoading] = useState(false);
  const [openAccountForm, setOpenAccountForm] = useState(false);
  const [openCarForm, setOpenCarForm] = useState(false);

  const navigatge = useNavigate();

  const { currentUser, logout } = useAuth();
  const { language } = useContext(LanguageContext);

  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  const handleClickOpenAccountForm = () => {
    setOpenAccountForm(true);
  };

  const handleCloseAccountForm = () => {
    setOpenAccountForm(false);
  };

  const handleClickOpenCarForm = () => {
    setOpenCarForm(true);
  };

  const handleCloseCarForm = () => {
    setOpenCarForm(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate("/admin");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, position: "relative" }}>
      <AppBar position="fixed" ref={navbarRef}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" component="div">
            Yooke Admin
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">
              {currentUser?.email || language.email}
            </Typography>
            <IconButton
              onClick={handleLogout}
              disabled={loading}
              color="inherit"
            >
              {loading ? <CircularProgress size={24} /> : <ExitToAppIcon />}
            </IconButton>
          </Box>
        </Toolbar>
        {/* Tabs for switching between "Accounts" and "Waiting List" */}
        <Box
          sx={{
            // padding: "16px 16px 0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "white",
            px: 1,
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Accounts" />
              <Tab label="Waiting List" />
              <Tab label="Cars" />
              <Tab label="Recurring Rides" />
              <Tab label="Calendar" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleClickOpenAccountForm}
            >
              Add Account
            </Button>
          )}
          {tabValue === 2 && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleClickOpenCarForm}
            >
              Add Car
            </Button>
          )}
        </Box>
      </AppBar>
      <Toolbar sx={{ height: navbarHeight, backgroundColor: "#fff" }} />
      <AdminAddNew
        open={openAccountForm}
        handleClose={handleCloseAccountForm}
      />
      <CarForm open={openCarForm} handleClose={handleCloseCarForm} />
    </Box>
  );
};

export default AdminNavbar;

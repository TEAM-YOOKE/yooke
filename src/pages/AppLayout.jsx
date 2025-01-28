import React, { useEffect, useState, useContext } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { Outlet, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import { useTheme } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useAuth } from "../helpers/GeneralContext";
import ConfettiComponent from "../components/ConfettiComponent";
import { LanguageContext } from "../helpers/LanguageContext";
import { Toolbar } from "@mui/material";

function AppLayout() {
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { unreadCount, appLoading, currentUser, notifications } = useAuth();
  const { language } = useContext(LanguageContext);

  const [value, setValue] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    // Determine the value based on the current location
    switch (location.pathname) {
      case "/app/home":
        setValue(0);
        break;
      case "/app/connections":
        setValue(1);
        break;
      case "/app/notifications":
        setValue(2);
        break;
      case "/app/account":
        setValue(3);
        break;
      default:
        setValue(0);
        break;
    }
  }, [location]);

  useEffect(() => {
    if (!currentUser) return;

    // Check for new connection requests for car owners
    const newConnectionRequest = notifications.some(
      (notification) =>
        notification.type === "connectionRequest" &&
        notification.receiverId === currentUser.uid &&
        !notification.readStatus
    );

    if (newConnectionRequest) {
      setShowConfetti(true);
      setSnackbarMessage(language.appLayout.newConnectionRequest);
      setSnackbarOpen(true);
      return;
    }

    // Check for accepted connection requests for passengers
    const acceptedConnectionRequest = notifications.some(
      (notification) =>
        notification.type === "requestAccepted" &&
        notification.receiverId === currentUser.uid &&
        !notification.readStatus
    );

    if (acceptedConnectionRequest) {
      setShowConfetti(true);
      setSnackbarMessage(language.appLayout.acceptedRequest);
      setSnackbarOpen(true);
    }
  }, [
    notifications,
    currentUser,
    language.appLayout.newConnectionRequest,
    language.appLayout.acceptedRequest,
  ]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setShowConfetti(false); // Hide confetti after snack bar closes
  };

  const hideBottomNav = [
    "/app/available-routes",
    "/app/your-path",
    "/app/full-profile",
    "/app/language",
    "/app/faqs",
    "/app/settings",
  ].some((path) => location.pathname.startsWith(path));

  if (appLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "1fr auto",
        position: "relative",
        height: "100vh",
      }}
    >
      <ConfettiComponent showConfetti={showConfetti} />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ bottom: 72 }} // 56px (bottom nav height) + 16px
      >
        <MuiAlert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <Box sx={{ overflowY: "auto" }}>
        <Outlet />
      </Box>
      {!hideBottomNav && (
        <Box
          sx={{
            boxShadow:
              "0px 1px 1px rgba(0, 0, 0, 0.14),  0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)",
          }}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            sx={{
              backgroundColor: theme.palette.background.default,
              "& .Mui-selected, .Mui-selected svg": {
                color: theme.palette.secondary.main,
              },
              position: "fixed",
              bottom: 0,
              width: "100%",
              zIndex: 1000,
            }}
          >
            <BottomNavigationAction
              label={language.appLayout.home}
              icon={<HomeIcon />}
              onClick={() => {
                navigate("/app/home");
              }}
            />
            <BottomNavigationAction
              label={language.appLayout.connections}
              icon={<ConnectWithoutContactIcon />}
              onClick={() => {
                navigate("/app/connections");
              }}
            />
            <BottomNavigationAction
              onClick={() => {
                navigate("/app/notifications");
              }}
              label={language.appLayout.notifications}
              icon={
                <Badge badgeContent={unreadCount} color="primary">
                  <NotificationsIcon />
                </Badge>
              }
            />
            <BottomNavigationAction
              label={language.appLayout.account}
              icon={<PersonIcon />}
              onClick={() => {
                navigate("/app/account");
              }}
            />
          </BottomNavigation>
          <Toolbar />
        </Box>
      )}
    </Box>
  );
}

export default AppLayout;

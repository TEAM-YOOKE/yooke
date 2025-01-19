import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAuth } from "../helpers/GeneralContext";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../helpers/LanguageContext";
import useUserLocationRides from "../hooks/userLocationRides";

export default function Account() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { language } = useContext(LanguageContext);
  const { refreshRides } = useUserLocationRides();

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
    <Box sx={{ padding: "0", maxWidth: 400, margin: "0 auto" }}>
      <h1
        className="h2"
        style={{
          paddingTop: "47px",
          textAlign: "center",
          paddingBottom: "20px",
        }}
      >
        {language.account}
      </h1>
      <Box
        display="flex"
        alignItems="center"
        sx={{
          padding: "16px",
          margin: "0 16px 16px 16px",
          backgroundColor: "#eee",
          borderRadius: "16px",
          cursor: "pointer",
          ":active": {
            backgroundColor: "#ddd",
          },
        }}
        onClick={() => navigate("/app/settings")}
      >
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: "grey.500",
            marginRight: "16px",
          }}
        >
          {currentUser?.username?.charAt(0).toUpperCase()}
        </Avatar>
        <Box flexGrow={1}>
          <Typography variant="h6">
            {currentUser?.username || language.username}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {currentUser?.whatsappNumber || "+237 670907115"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {currentUser?.email || "ray.jhon@gmail.com"}
          </Typography>
        </Box>
        <ArrowForwardIosIcon />
      </Box>
      <Divider />
      <List>
        <ListItem button onClick={() => navigate("/app/language")}>
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText
            primary={language.language}
            secondary={language.currentLanguage}
          />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => navigate("/app/faqs")}>
          <ListItemIcon>
            <HelpOutlineIcon />
          </ListItemIcon>
          <ListItemText
            primary={language.faq}
            secondary={language.faqDescription}
          />
        </ListItem>
        <Divider />
        <ListItem button component="a" href="mailto:support@yooke.com">
          <ListItemIcon>
            <HeadsetMicIcon />
          </ListItemIcon>
          <ListItemText
            primary={language.support}
            secondary={language.supportEmail}
          />
        </ListItem>
        <Divider />
        <ListItem button onClick={handleLogout} disabled={loading}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary={language.logout} />
          {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
        </ListItem>
        <Divider />
      </List>
    </Box>
  );
}

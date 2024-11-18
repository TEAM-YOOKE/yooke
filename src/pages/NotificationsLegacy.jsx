import React, { useContext } from "react";
import {
  Box,
  Typography,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { LanguageContext } from "../helpers/LanguageContext";

// Dummy data for notifications
const notifications = [
  {
    id: 1,
    name: "John Doe",
    action: "accepted your connection request.",
    link: "/profile/johndoe",
    type: "accept",
  },
  {
    id: 2,
    name: "Jane Smith",
    action: "sent you a connection request.",
    link: "/profile/janesmith",
    type: "request",
  },
  {
    id: 3,
    name: "Alex Johnson",
    action: "accepted your connection request.",
    link: "/profile/alexjohnson",
    type: "accept",
  },
  {
    id: 4,
    name: "Emily Davis",
    action: "sent you a connection request.",
    link: "/profile/emilydavis",
    type: "request",
  },
];

const NotificationsLegacy = () => {
  const { language } = useContext(LanguageContext);

  return (
    <Box sx={{ flexGrow: 1, margin: "auto", padding: 2 }}>
      <h1
        className="h2"
        style={{
          paddingTop: "47px",
          textAlign: "left",
        }}
      >
        {language.notificationsLegacy.title}
      </h1>
      <List>
        {notifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem sx={{ paddingLeft: 0 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "grey.300" }}>
                  {notification.type === "accept" ? (
                    <CheckCircleIcon color="action" />
                  ) : (
                    <PersonAddIcon color="action" />
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" component="span">
                    <Link
                      href={notification.link}
                      underline="hover"
                      sx={{
                        textDecoration: "underline",
                      }}
                    >
                      {notification.name}
                    </Link>{" "}
                    {notification.type === "accept"
                      ? language.notificationsLegacy.acceptedRequest
                      : language.notificationsLegacy.sentRequest}
                  </Typography>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default NotificationsLegacy;

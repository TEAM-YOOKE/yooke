import React, { useEffect, useState, useContext } from "react";
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
import { useAuth } from "../helpers/GeneralContext";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../helpers/LanguageContext";
import { customFormatDistanceToNow } from "../helpers/customDateUtils"; // Import the custom function

const NotificationsPassenger = () => {
  const { notifications, currentUser, markNotificationsAsRead } = useAuth();
  const { language, languageCode } = useContext(LanguageContext);
  const [passengerNotifications, setPassengerNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filterAndSortNotifications = async () => {
      if (currentUser) {
        await markNotificationsAsRead();
        const filteredNotifications = notifications.filter(
          (notification) => notification.type === "requestAccepted"
        );
        const sortedNotifications = filteredNotifications.sort(
          (a, b) => b.time.seconds - a.time.seconds
        );
        setPassengerNotifications(sortedNotifications);
      }
    };

    filterAndSortNotifications();
  }, [currentUser, notifications, markNotificationsAsRead]);

  return (
    <Box sx={{ flexGrow: 1, margin: "auto", padding: "16px 0 16px 0" }}>
      <h1
        className="h2"
        style={{
          paddingTop: "31px",
          textAlign: "center",
          paddingBottom: "20px",
        }}
      >
        {language.notificationsPassenger.title}
      </h1>
      {passengerNotifications.length === 0 ? (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <img
            src="/empty.png"
            width="150px"
            style={{ marginTop: "40px" }}
            alt={language.notificationsPassenger.noNotificationsAlt}
          />
          <Typography sx={{ opacity: 0.6, marginTop: 1 }}>
            {language.notificationsPassenger.noNotificationsMessage}
          </Typography>
        </Box>
      ) : (
        <List>
          {passengerNotifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem
                sx={{
                  display: "block",
                  paddingLeft: 2,
                  backgroundColor:
                    notification.highlightUntil &&
                    notification.highlightUntil.toMillis() > Date.now()
                      ? "#E4F9F4"
                      : "white",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "grey.300" }}>
                      <PersonAddIcon color="action" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" component="span">
                        <Link
                          onClick={() =>
                            navigate(`/full-profile/${notification.senderId}`)
                          }
                          underline="hover"
                          sx={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          {notification.senderName ||
                            language.notificationsPassenger.unknownSender}
                        </Link>{" "}
                        {language.notificationsPassenger.acceptedYourRequest}
                      </Typography>
                    }
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    marginLeft: 7,
                    opacity: 0.6,
                    marginBottom: "4px",
                  }}
                >
                  <i>
                    <p>
                      {language.notificationsPassenger.time}:{" "}
                      {customFormatDistanceToNow(
                        new Date(notification.time.seconds * 1000),
                        {
                          locale: languageCode,
                        }
                      )}
                    </p>
                  </i>
                </Box>
              </ListItem>
              <Divider variant="inset" component="li" sx={{ marginLeft: 9 }} />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default NotificationsPassenger;

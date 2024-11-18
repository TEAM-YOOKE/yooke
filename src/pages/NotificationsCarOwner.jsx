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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useAuth } from "../helpers/GeneralContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase-config";
import { doc, deleteDoc, writeBatch, collection } from "firebase/firestore";
import { LanguageContext } from "../helpers/LanguageContext";
import { customFormatDistanceToNow } from "../helpers/customDateUtils"; // Import the custom function

const NotificationsCarOwner = () => {
  const { notifications, currentUser, markNotificationsAsRead } = useAuth();
  const [carOwnerNotifications, setCarOwnerNotifications] = useState([]);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const navigate = useNavigate();
  const { language, languageCode } = useContext(LanguageContext);

  useEffect(() => {
    if (currentUser) {
      markNotificationsAsRead();
      const filteredNotifications = notifications.filter(
        (notification) => notification.type === "connectionRequest"
      );
      const sortedNotifications = filteredNotifications.sort(
        (a, b) => b.time.seconds - a.time.seconds
      );
      setCarOwnerNotifications(sortedNotifications);
    }
  }, [currentUser, notifications, markNotificationsAsRead]);

  const handleAccept = async (notification) => {
    const batch = writeBatch(db);
    const notificationRef = doc(collection(db, "notifications"));
    const connectionRef = doc(collection(db, "connections"));

    batch.set(notificationRef, {
      senderId: currentUser.uid,
      senderEmail: currentUser.email,
      receiverId: notification.senderId,
      type: "requestAccepted",
      time: new Date(),
      readStatus: false,
    });

    batch.set(connectionRef, {
      person1: currentUser.email,
      person2: notification.senderEmail,
    });

    try {
      await batch.commit();
      // Delete the notification from the UI state
      setCarOwnerNotifications((prevNotifications) =>
        prevNotifications.filter((n) => n.id !== notification.id)
      );
      // Optionally delete the notification from the database
      await deleteDoc(doc(db, "notifications", notification.id));
    } catch (error) {
      console.error("Error accepting connection request: ", error);
    }
  };

  const handleReject = async () => {
    if (!selectedNotification) return;
    try {
      const notificationRef = doc(db, "notifications", selectedNotification.id);
      await deleteDoc(notificationRef);
      setCarOwnerNotifications((prevNotifications) =>
        prevNotifications.filter((n) => n.id !== selectedNotification.id)
      );
      setOpenRejectDialog(false);
    } catch (error) {
      console.error("Error rejecting connection request: ", error);
    }
  };

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
        {language.notificationsCarOwner.title}
      </h1>
      {carOwnerNotifications.length === 0 ? (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <img
            src="/empty.png"
            width="150px"
            style={{ marginTop: "40px" }}
            alt={language.notificationsCarOwner.noNotificationsAlt}
          />
          <Typography sx={{ opacity: 0.6, marginTop: 1 }}>
            {language.notificationsCarOwner.noNotificationsMessage}
          </Typography>
        </Box>
      ) : (
        <List>
          {carOwnerNotifications.map((notification) => (
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
                            language.notificationsCarOwner.unknownSender}
                        </Link>{" "}
                        {
                          language.notificationsCarOwner
                            .sentYouAConnectionRequest
                        }
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
                      {language.notificationsCarOwner.seats}:{" "}
                      {notification.seats} |{" "}
                      {language.notificationsCarOwner.time}:{" "}
                      {customFormatDistanceToNow(
                        new Date(notification.time.seconds * 1000),
                        {
                          locale: languageCode,
                        }
                      )}{" "}
                      {language.notificationsCarOwner.ago}
                    </p>
                  </i>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: 6,
                  }}
                >
                  <Button
                    variant="text"
                    color="secondary"
                    sx={{ borderRadius: "20px", marginRight: 1 }}
                    onClick={() => handleAccept(notification)}
                  >
                    {language.notificationsCarOwner.accept}
                  </Button>
                  <Button
                    variant="text"
                    color="primary"
                    sx={{ borderRadius: "20px" }}
                    onClick={() => {
                      setSelectedNotification(notification);
                      setOpenRejectDialog(true);
                    }}
                  >
                    {language.notificationsCarOwner.reject}
                  </Button>
                </Box>
              </ListItem>
              <Divider variant="inset" component="li" sx={{ marginLeft: 9 }} />
            </React.Fragment>
          ))}
        </List>
      )}
      <Dialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {language.notificationsCarOwner.confirmRejectionTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {language.notificationsCarOwner.confirmRejectionMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)} color="primary">
            {language.notificationsCarOwner.cancel}
          </Button>
          <Button onClick={handleReject} color="primary" autoFocus>
            {language.notificationsCarOwner.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationsCarOwner;

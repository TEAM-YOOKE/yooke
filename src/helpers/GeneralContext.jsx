import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../firebase-config";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  writeBatch,
  doc,
  Timestamp,
} from "firebase/firestore";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const fetchSenderNames = async (notifications) => {
  const notificationsWithSenderNames = await Promise.all(
    notifications.map(async (notification) => {
      if (!notification.senderEmail) {
        return { ...notification, senderName: "Unknown" };
      }

      const senderRef = collection(db, "accounts");
      const senderQuery = query(
        senderRef,
        where("email", "==", notification.senderEmail)
      );
      const senderSnapshot = await getDocs(senderQuery);

      if (!senderSnapshot.empty) {
        const senderDoc = senderSnapshot.docs[0];
        const senderData = senderDoc.data();
        return {
          ...notification,
          senderName: senderData.username || "Unknown",
        };
      } else {
        return { ...notification, senderName: "Unknown" };
      }
    })
  );

  return notificationsWithSenderNames;
};

const fetchConnectionsData = async (emails) => {
  const connectionPromises = emails.map(async (email) => {
    if (email) {
      const accountsRef = collection(db, "accounts");
      const accountQuery = query(accountsRef, where("email", "==", email));
      const accountSnapshot = await getDocs(accountQuery);

      if (!accountSnapshot.empty) {
        const accountData = accountSnapshot.docs[0].data();
        const profileColor = `rgb(${accountData.profileColor.r}, ${accountData.profileColor.g}, ${accountData.profileColor.b})`;

        return {
          id: accountData.uid,
          username: accountData.username,
          email: accountData.email,
          whatsappNumber: accountData.whatsappNumber,
          carImages: accountData.carImages,
          profileColor,
        };
      }
    }
    return null;
  });

  const resolvedConnectionDetails = await Promise.all(connectionPromises);
  return resolvedConnectionDetails.filter((detail) => detail !== null);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const [loading, setLoading] = useState(true);
  const [rideData, setRideData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connections, setConnections] = useState([]);
  const [appLoading, setAppLoading] = useState(true);

  const theme = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        try {
          const q = query(
            collection(db, "accounts"),
            where("email", "==", user.email)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = { ...user, ...userDoc.data(), docId: userDoc.id };
            setCurrentUser(userData);
            localStorage.setItem("currentUser", JSON.stringify(userData));

            const rideQuery = query(
              collection(db, "rides"),
              where("driverId", "==", user.uid)
            );
            const rideQuerySnapshot = await getDocs(rideQuery);

            if (!rideQuerySnapshot.empty) {
              const rideDoc = rideQuerySnapshot.docs[0];
              setRideData({ ...rideDoc.data(), docId: rideDoc.id });
            } else {
              setRideData(null);
            }

            const notificationsQuery = query(
              collection(db, "notifications"),
              where("receiverId", "==", user.uid)
            );
            const unsubscribeNotifications = onSnapshot(
              notificationsQuery,
              async (querySnapshot) => {
                const notificationsData = [];
                let unread = 0;
                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  if (!data.readStatus) {
                    unread++;
                  }
                  notificationsData.push({ id: doc.id, ...data });
                });

                const notificationsWithSenderNames = await fetchSenderNames(
                  notificationsData
                );

                setNotifications(notificationsWithSenderNames);
                setUnreadCount(unread);
                setAppLoading(false);
              }
            );

            const connectionsRef = collection(db, "connections");
            const q1 = query(
              connectionsRef,
              where("person1", "==", user.email)
            );
            const q2 = query(
              connectionsRef,
              where("person2", "==", user.email)
            );

            const handleConnectionSnapshot = async (snapshot, isPerson1) => {
              const connectedEmails = new Set();
              snapshot.forEach((doc) => {
                const data = doc.data();
                if (isPerson1 ? data.person2 : data.person1) {
                  connectedEmails.add(isPerson1 ? data.person2 : data.person1);
                }
              });

              const connectionsData = await fetchConnectionsData(
                Array.from(connectedEmails)
              );
              setConnections((prevConnections) => {
                const updatedConnections = [
                  ...prevConnections,
                  ...connectionsData,
                ];
                const uniqueConnections = updatedConnections.filter(
                  (connection, index, self) =>
                    index === self.findIndex((c) => c.id === connection.id)
                );
                return uniqueConnections;
              });
            };

            const unsubscribeConnections1 = onSnapshot(q1, (snapshot) =>
              handleConnectionSnapshot(snapshot, true)
            );

            const unsubscribeConnections2 = onSnapshot(q2, (snapshot) =>
              handleConnectionSnapshot(snapshot, false)
            );

            setLoading(false);

            return () => {
              unsubscribeNotifications();
              unsubscribeConnections1();
              unsubscribeConnections2();
            };
          } else {
            setCurrentUser(null);
            localStorage.removeItem("currentUser");
            setRideData(null);
            setAppLoading(false);
            setLoading(false);
          }
        } catch (error) {
          setCurrentUser(null);
          localStorage.removeItem("currentUser");
          setRideData(null);
          setAppLoading(false);
          setLoading(false);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
        setRideData(null);
        setAppLoading(false);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const markNotificationsAsRead = async () => {
    const batch = writeBatch(db);
    const highlightDuration = 90 * 1000;

    notifications.forEach((notification) => {
      if (!notification.readStatus) {
        const notificationRef = doc(db, "notifications", notification.id);
        batch.update(notificationRef, {
          readStatus: true,
          highlightUntil: Timestamp.fromMillis(Date.now() + highlightDuration),
        });
      }
    });
    await batch.commit();
  };

  const updateUser = async (email) => {
    try {
      const q = query(collection(db, "accounts"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = {
          ...currentUser,
          ...userDoc.data(),
          docId: userDoc.id,
        };

        setCurrentUser(userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));

        const rideQuery = query(
          collection(db, "rides"),
          where("driverId", "==", userData.uid)
        );
        const rideQuerySnapshot = await getDocs(rideQuery);
        if (!rideQuerySnapshot.empty) {
          const rideDoc = rideQuerySnapshot.docs[0];
          setRideData({ ...rideDoc.data(), docId: rideDoc.id });
        } else {
          setRideData(null);
        }
      }
    } catch (error) {
      console.error("Error updating user data: ", error);
    }
  };

  const logout = () => {
    signOut(auth);
    localStorage.removeItem("currentUser");
  };

  const value = {
    currentUser,
    loading,
    rideData,
    notifications,
    unreadCount,
    connections,
    appLoading,
    updateUser,
    logout,
    markNotificationsAsRead,
  };

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import React, { useEffect, useState, useContext } from "react";
import { Box } from "@mui/system";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { CircularProgress } from "@mui/material";
import { db } from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AvailableRoutesContext } from "../helpers/AvailableRoutesContext";

export function AvailableRoutesList({
  pickup,
  dropoff,
  time,
  seats,
  onRouteClick,
}) {
  const { setAvailableRoutes, setCachedSearches, cachedSearches } = useContext(
    AvailableRoutesContext
  );
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      const cacheKey = `${pickup}-${dropoff}-${time}-${seats}`;

      if (cachedSearches[cacheKey]) {
        setRides(cachedSearches[cacheKey]);
        setAvailableRoutes(cachedSearches[cacheKey]);
        setLoading(false);
        return;
      }

      setLoading(true); // Set loading true only when we are sure no cache is available

      const ridesCollection = collection(db, "rides");
      const ridesQuery = query(
        ridesCollection,
        where("stopPoints", "array-contains", pickup)
      );
      const ridesSnapshot = await getDocs(ridesQuery);

      const matchedRides = [];
      ridesSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.stopPoints.includes(dropoff)) {
          matchedRides.push({ id: doc.id, ...data });
        }
      });

      matchedRides.sort((a, b) => {
        const timeA = new Date(a.leaveTime).getTime();
        const timeB = new Date(b.leaveTime).getTime();
        const requestTime = new Date(time).getTime();
        return Math.abs(timeA - requestTime) - Math.abs(timeB - requestTime);
      });

      if (matchedRides.length < 12) {
        const randomRidesSnapshot = await getDocs(ridesCollection);
        const randomRides = [];
        randomRidesSnapshot.forEach((doc) => {
          const data = doc.data();
          if (!matchedRides.some((ride) => ride.id === doc.id)) {
            randomRides.push({ id: doc.id, ...data });
          }
        });
        matchedRides.push(...randomRides.slice(0, 12 - matchedRides.length));
      }

      setRides(matchedRides);
      setAvailableRoutes(matchedRides);

      // Cache the search results in the context
      setCachedSearches((prevCachedSearches) => ({
        ...prevCachedSearches,
        [cacheKey]: matchedRides,
      }));

      setLoading(false);
    };

    // Fetch rides on component mount or when parameters change
    fetchRides();
  }, [
    pickup,
    dropoff,
    time,
    seats,
    setAvailableRoutes,
    setCachedSearches,
    cachedSearches,
  ]);

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <CircularProgress sx={{ color: "#001023", marginRight: "10px" }} />
      </Box>
    );
  }

  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        "& > li": { padding: 0 },
      }}
    >
      {rides.map((ride) => (
        <Route
          key={ride.id}
          id={ride.id}
          driverName={ride.driverName || "No Name"}
          carName={ride.carName}
          time={formatTime(ride.leaveTime)}
          seats={seats}
          onClick={() => onRouteClick(ride)}
        />
      ))}
    </List>
  );
}

const Route = ({ id, driverName, carName, time, seats, onClick }) => {
  return (
    <ListItem>
      <ListItemButton sx={{ display: "block", padding: "0" }} onClick={onClick}>
        <Box
          sx={{
            display: "flex",
            padding: "8px 16px",
            justifyContent: "space-between",
            width: "100%",
            color: "rgba(0, 0, 0, .6)",
            "& div.amount": {
              fontWeight: "medium",
              fontSize: "19.67px",
            },
            "& div.driverName": {
              fontWeight: "regular",
              fontSize: "19.67px",
              color: "rgb(0, 0, 0)",
            },
            "& div.time": {
              color: "#22CEA6",
            },
          }}
        >
          <Box>
            <div className="driverName">{driverName}</div>
            <div>{carName}</div>
          </Box>
          <Box>
            <div className="time">{time}</div>
          </Box>
        </Box>
        <Box sx={{ marginTop: "8px" }}>
          <Box sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)" }} />
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

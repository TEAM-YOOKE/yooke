import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { db } from "../firebase-config";
import { collection, query, onSnapshot } from "firebase/firestore";
import { format } from "date-fns"; // Importing date-fns for formatting

const WaitingList = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [sortOrder, setSortOrder] = useState("email"); // Default sorting by email

  useEffect(() => {
    const q = query(collection(db, "waitinglist"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const waitingListData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        waitingListData.push({
          id: doc.id,
          email: data.email,
          date: data.date?.toDate() || null, // Convert Firestore Timestamp to JavaScript Date
        });
      });
      setWaitingList(waitingListData);
    });

    return () => unsubscribe();
  }, []);

  const handleSortChange = (sortOption) => {
    setSortOrder(sortOption);
  };

  const sortedWaitingList = waitingList.sort((a, b) => {
    return sortOrder === "email"
      ? a.email.localeCompare(b.email)
      : new Date(b.date) - new Date(a.date);
  });

  return (
    <Box sx={{ overflow: "auto" }}>
      <Box sx={{ m: 2, display: "flex", gap: 1 }}>
        <Chip
          label="Order by Email (A-Z)"
          color={sortOrder === "email" ? "primary" : "default"}
          onClick={() => handleSortChange("email")}
        />
        <Chip
          label="Most Recently Added"
          color={sortOrder === "recent" ? "primary" : "default"}
          onClick={() => handleSortChange("recent")}
        />
      </Box>
      <List>
        {sortedWaitingList.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body1">
                  <strong>Email:</strong> {item.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Date Added:</strong>{" "}
                  {item.date
                    ? format(new Date(item.date), "MMMM d, yyyy hh:mm a") // Human-friendly format
                    : "N/A"}
                </Typography>
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default WaitingList;

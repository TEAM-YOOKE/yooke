import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { db } from "../firebase-config";
import {
  collection,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

const AdminUsersList = ({ searchQuery, accountType }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "accounts"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "accounts", id));
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearchQuery =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAccountType =
      accountType === "All" || user.accountType === accountType;

    return matchesSearchQuery && matchesAccountType;
  });

  const sortedUsers = filteredUsers.sort((a, b) =>
    a.email.localeCompare(b.email)
  );

  return (
    <Box>
      <List>
        {sortedUsers.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body1">
                  <strong>Email:</strong> {item.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Company:</strong> {item.company}
                </Typography>
                <Typography variant="body2">
                  <strong>Initial Password:</strong> {item.initialPassword}
                </Typography>
                <Typography variant="body2">
                  <strong>Account Type:</strong> {item.accountType}
                </Typography>
              </Box>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(item.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default AdminUsersList;

import {
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  ListItem,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import React from "react";

const ACard1 = ({ user, handleDelete, handleClickOpenAccountForm }) => {
  console.log(user);
  return (
    <Box key={user.id}>
      <ListItem
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="body1">
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body1">
            <strong>Username:</strong> {user?.username || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>WhatsApp:</strong> {user?.whatsappNumber || "N/A"}
          </Typography>
          <Typography variant="body1" sx={{ color: "#4a4a4a" }}>
            <strong>Location:</strong>{" "}
            {user?.pickUpLocation?.address?.structured_formatting?.main_text ||
              user?.pickUpLocation ||
              "N/A"}
          </Typography>
          <Typography variant="body2">
            <strong>Company:</strong> {user.company}
          </Typography>
          <Typography variant="body2">
            <strong>Initial Password:</strong> {user.initialPassword}
          </Typography>
          <Typography variant="body2">
            <strong>Account Type:</strong> {user.accountType}
          </Typography>
        </Box>
        <Box
          edge="end"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <IconButton
            size="small"
            aria-label="edit"
            sx={{ mb: 2 }}
            onClick={() => handleClickOpenAccountForm(user)}
          >
            <EditIcon fontSize="small" sx={{ color: "blue" }} />
          </IconButton>
          <IconButton
            size="small"
            aria-label="delete"
            onClick={() => {
              if (
                window.confirm(`Are you sure you want to delete ${user.email}?`)
              )
                handleDelete(user.id);
            }}
          >
            <DeleteIcon fontSize="small" sx={{ color: "red" }} />
          </IconButton>{" "}
        </Box>
      </ListItem>
      <Divider />
    </Box>
  );
};

const ACard2 = ({ user, handleDelete }) => {
  return (
    <Card
      key={user.id}
      sx={{
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        backgroundColor: "#fff",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
        },
      }}
    >
      <CardContent>
        <Typography variant="body1" sx={{ color: "#4a4a4a" }}>
          <strong>Location:</strong>{" "}
          {user?.pickUpLocation?.address?.structured_formatting?.main_text ||
            user?.pickUpLocation}
        </Typography>
        <Typography variant="body1" sx={{ color: "#4a4a4a" }}>
          <strong>Company:</strong> {user.company}
        </Typography>
        <Typography variant="body1" sx={{ color: "#4a4a4a" }}>
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="body2" sx={{ color: "#6c757d" }}>
          <strong>Initial Password:</strong> {user.initialPassword}
        </Typography>
        <Typography variant="body2" sx={{ color: "#6c757d" }}>
          <strong>Account Type:</strong> {user.accountType}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "0.5rem 1rem",
        }}
      >
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => handleDelete(user.id)}
          //   sx={{
          //     backgroundColor: "#ffcccc",
          //     "&:hover": {
          //       backgroundColor: "#ffaaaa",
          //     },
          //   }}
        >
          <DeleteIcon sx={{ color: "#d9534f" }} />
        </IconButton>
      </CardActions>
    </Card>
  );
};

const AccountCard = ({ user, handleDelete, handleClickOpenAccountForm }) => {
  return (
    <ACard1
      user={user}
      handleDelete={handleDelete}
      handleClickOpenAccountForm={handleClickOpenAccountForm}
    />
  );
};

export default AccountCard;

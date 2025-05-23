import React from "react";
import { Box, Typography, Avatar, Paper, Button, Link } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { styled } from "@mui/system";

// Colors array
const colors = [
  { r: 255, g: 59, b: 48 }, // Red
  { r: 255, g: 149, b: 0 }, // Orange
  { r: 255, g: 204, b: 0 }, // Yellow
  { r: 52, g: 199, b: 89 }, // Green
  { r: 0, g: 199, b: 190 }, // Light Blue
  { r: 48, g: 176, b: 199 }, // Sky Blue
  { r: 50, g: 173, b: 230 }, // Blue
  { r: 0, g: 122, b: 255 }, // Dark Blue
  { r: 88, g: 86, b: 214 }, // Purple
  { r: 175, g: 82, b: 222 }, // Violet
  { r: 255, g: 45, b: 85 }, // Bright Red
  { r: 162, g: 132, b: 94 }, // Brown
];

// Function to get a random color from the array
const getRandomColor = () => {
  const color = colors[Math.floor(Math.random() * colors.length)];
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
};

// Styles for the component
const Card = styled(Paper)(({ theme }) => ({
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#ffffff",
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  marginBottom: theme.spacing(2),
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  border: `3px solid #ffffff`,
  zIndex: 1,
}));

const BackgroundCircle = styled(Box)(({ theme, color }) => ({
  position: "absolute",
  top: -theme.spacing(4),
  left: "50%",
  transform: "translateX(-50%)",
  width: theme.spacing(16),
  height: theme.spacing(8),
  borderRadius: `${theme.spacing(8)}px ${theme.spacing(8)}px 0 0`,
  backgroundColor: color,
}));

const Details = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

const Icon = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  marginTop: theme.spacing(2),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  width: "100%",
  backgroundColor: "#E0E0E0", // Grey color similar to chips
  color: "#000000", // Black text color
  borderRadius: "60px", // Rounded corners
  boxShadow: "none", // No elevation
  "&:hover": {
    backgroundColor: "#D5D5D5", // Slightly darker grey on hover
  },
  "&:active": {
    boxShadow: "none", // No elevation on click
  },
}));

const PassengerCard = ({
  name,
  email,
  whatsapp,
  pickup,
  dropoff,
  seats,
  leavingTime,
  avatar,
}) => {
  const randomColor = getRandomColor();

  return (
    <Card sx={{ borderRadius: "16px", overflow: "hidden" }}>
      <AvatarContainer
        sx={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <BackgroundCircle
          color={randomColor}
          sx={{ width: "100%", opacity: "40%" }}
        />
        <ProfileAvatar src={avatar} alt={name} />
      </AvatarContainer>
      <Typography variant="h6">
        <Link href="/full-profile" underline="hover">
          {name}
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {email}
      </Typography>
      <Box sx={{ padding: "0 16px 16px 16px", width: "100%" }}>
        <Details>
          <Icon>
            <WhatsAppIcon />
          </Icon>
          <Typography variant="body2">Whatsapp</Typography>
          <Typography variant="body2" style={{ marginLeft: "auto" }}>
            {whatsapp}
          </Typography>
        </Details>
        <Details>
          <Icon>
            <AccessTimeIcon />
          </Icon>
          <Typography variant="body2">Leaving Time</Typography>
          <Typography variant="body2" style={{ marginLeft: "auto" }}>
            {leavingTime}
          </Typography>
        </Details>
        <Details>
          <Icon>
            <LocationOnIcon />
          </Icon>
          <Typography variant="body2">Pickup</Typography>
          <Typography variant="body2" style={{ marginLeft: "auto" }}>
            {pickup}
          </Typography>
        </Details>
        <Details>
          <Icon>
            <LocationOnIcon />
          </Icon>
          <Typography variant="body2">Dropoff</Typography>
          <Typography variant="body2" style={{ marginLeft: "auto" }}>
            {dropoff}
          </Typography>
        </Details>
        <Details>
          <Icon>
            <AirlineSeatReclineNormalIcon />
          </Icon>
          <Typography variant="body2">Seats</Typography>
          <Typography variant="body2" style={{ marginLeft: "auto" }}>
            {seats}
          </Typography>
        </Details>
        <ButtonContainer>
          <ActionButton variant="contained" disableElevation>
            Message in WhatsApp
          </ActionButton>
        </ButtonContainer>
      </Box>
    </Card>
  );
};

export default PassengerCard;

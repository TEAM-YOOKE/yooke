import React from "react";
import { Box, Typography, Avatar, Paper, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { styled } from "@mui/system";

// Function to generate random pastel colors
const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, 85%)`;
};

// Styles for the component
const Card = styled(Paper)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
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

const FullProfile = ({
  name,
  email,
  whatsapp,
  pickup,
  dropoff,
  seats,
  leavingTime,
  avatar,
}) => {
  const navigate = useNavigate();
  const pastelColor = getRandomPastelColor();

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>
      <Card>
        <AvatarContainer>
          <BackgroundCircle color={pastelColor} />
          <ProfileAvatar src={avatar} alt={name} />
        </AvatarContainer>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {email}
        </Typography>
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
      </Card>
    </Box>
  );
};

export default FullProfile;

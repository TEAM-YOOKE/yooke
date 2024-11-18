import React, { useContext } from "react";
import { Box, Typography, Avatar, Paper, Button } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { styled } from "@mui/system";
import { LanguageContext } from "../helpers/LanguageContext";

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
  width: theme.spacing(8),
  height: theme.spacing(8),
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
  backgroundColor: "#eee",
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

const ConnectionCard = ({
  username,
  email,
  whatsappNumber,
  carImages,
  profileColor,
}) => {
  const { language } = useContext(LanguageContext);
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <Card sx={{ borderRadius: "16px", overflow: "hidden" }}>
      <AvatarContainer
        sx={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <BackgroundCircle color="#eee" sx={{ width: "100%", opacity: "40%" }} />
        <ProfileAvatar sx={{ bgcolor: profileColor, top: "32px" }}>
          {username.charAt(0)}
        </ProfileAvatar>
      </AvatarContainer>
      <Typography variant="h6" mt={3}>
        {username}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {email}
      </Typography>
      <Box sx={{ padding: "0 16px 16px 16px", width: "100%" }}>
        <Details>
          <Icon>
            <WhatsAppIcon />
          </Icon>
          <Typography variant="body2">
            {language.connectionCard.whatsapp}
          </Typography>
          <Typography variant="body2" style={{ marginLeft: "auto" }}>
            {whatsappNumber}
          </Typography>
        </Details>
        {carImages && carImages.length > 0 && (
          <Box mt={2}>
            <Details>
              <Icon>
                <DirectionsCarIcon />
              </Icon>
              <Typography variant="body2">
                {language.connectionCard.carImages}
              </Typography>
              <Typography variant="body2" style={{ marginLeft: "auto" }}>
                {" "}
              </Typography>
            </Details>
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr 1fr"
              gap="4px"
              mt={2}
            >
              {carImages.map((image, index) => (
                <img
                  src={image}
                  alt={`${language.connectionCard.car} ${index + 1}`}
                  key={index}
                  style={{ width: "100%", height: "auto" }}
                />
              ))}
            </Box>
          </Box>
        )}
        <ButtonContainer>
          <ActionButton
            variant="contained"
            disableElevation
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {language.connectionCard.messageOnWhatsapp}
          </ActionButton>
        </ButtonContainer>
      </Box>
    </Card>
  );
};

export default ConnectionCard;

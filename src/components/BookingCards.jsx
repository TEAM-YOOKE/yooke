import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, CardActionArea } from "@mui/material";
import { LanguageContext } from "../helpers/LanguageContext";

export function BookingCards({ selectedSeats, setSelectedSeats }) {
  const { language } = React.useContext(LanguageContext);

  const handleSelect = (seats) => {
    setSelectedSeats(seats);
  };

  React.useEffect(() => {
    setSelectedSeats(1); // Default to 1 place
  }, [setSelectedSeats]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "16px",
        marginTop: "24px",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          border:
            selectedSeats === 1 ? "3px solid #22CEA6" : "1px solid #C4C4C4",
        }}
        onClick={() => handleSelect(1)}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height="58px"
            image="/solo-booking.png"
            alt={language.bookingCards.reserveOneSeat}
          />
          <CardContent>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              {language.bookingCards.reserveOneSeat}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Card
        variant="outlined"
        sx={{
          border:
            selectedSeats === 2 ? "3px solid #22CEA6" : "1px solid #C4C4C4",
        }}
        onClick={() => handleSelect(2)}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height="58px"
            image="/double-booking.png"
            alt={language.bookingCards.reserveTwoSeats}
          />
          <CardContent>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              {language.bookingCards.reserveTwoSeats}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Card
        variant="outlined"
        sx={{
          border:
            selectedSeats === 3 ? "3px solid #22CEA6" : "1px solid #C4C4C4",
        }}
        onClick={() => handleSelect(3)}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height="58px"
            image="/trio-booking.png"
            alt={language.bookingCards.reserveThreeSeats}
          />
          <CardContent>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              {language.bookingCards.reserveThreeSeats}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}

import * as React from "react";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
// import SelectLocation from "../components/SelectLocation";
// import { BookingCards } from "../components/BookingCards";
import { LanguageContext } from "../helpers/LanguageContext";
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";

function HomePassenger() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  const [pickupPoint, setPickupPoint] = useState("");
  const [dropOffPoint, setDropOffPoint] = useState("");
  const [departureTime, setDepartureTime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState(1);

  const isSearchEnabled =
    pickupPoint && dropOffPoint && departureTime && selectedSeats;

  const handleSearch = () => {
    if (isSearchEnabled) {
      navigate(
        `/app/available-routes?pickup=${pickupPoint}&dropoff=${dropOffPoint}&time=${departureTime}&seats=${selectedSeats}`
      );
    }
  };

  return (
    <Box sx={{ padding: "0 24px" }}>
      {/* <h1
        className="h2"
        style={{
          paddingTop: "47px",
          textAlign: "center",
          paddingBottom: "20px",
        }}
      >
        {language.homePassenger.findARide}
      </h1>

      <Box
        sx={{
          display: "grid",
          border: "1px solid #C4C4C4",
          gridTemplateColumns: "40px 1fr",
          padding: "16px 0",
          marginBottom: "24px",
          borderRadius: "6px",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateRows: "16px 29px 16px",
            marginLeft: "12px",
          }}
        >
          <Box
            sx={{
              width: "16px",
              height: "16px",
              border: "4px solid #39B54A",
              borderRadius: "16px",
            }}
          ></Box>
          <Box
            sx={{ borderLeft: "1px dashed #C4C4C4", marginLeft: "8px" }}
          ></Box>
          <Box
            sx={{
              width: "16px",
              height: "16px",
              border: "4px solid #FF0000",
              borderRadius: "16px",
            }}
          ></Box>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateRows: "1fr 1fr",
            "& > div": { display: "flex", color: "rgba(0, 0, 0, .7)" },
          }}
        >
          <SelectLocation
            label={language.homePassenger.pickupPoint}
            selectedLocation={pickupPoint}
            onSelect={setPickupPoint}
          />
          <SelectLocation
            label={language.homePassenger.dropOffPoint}
            selectedLocation={dropOffPoint}
            onSelect={setDropOffPoint}
            customStyles={{
              borderBottom: "none",
              position: "relative",
              top: "14px",
            }}
          />
        </Box>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          sx={{ width: "100%" }}
          label={language.homePassenger.selectDepartureTime}
          value={departureTime}
          onChange={(newValue) => setDepartureTime(newValue)}
        />
      </LocalizationProvider>

      <BookingCards
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
      /> */}

      
    <Typography
    
    sx={{
      fontWeight: '400', // Bold styling for the text
      color: '#333',       // Dark gray color
      marginBottom: '8px', // Margin below the Typography
      width: "369px",
      height: "96px",
      font: "jost"
    }} 

    >
      
     As an employee of XYZ company, a feet of cars will take care of your transportation. Please them know where they can pick you up
    </Typography>

      <Box paddingTop={3}>
      <TextField id="outlined-basic" label="pickup location" variant="outlined" 
      fullWidth
      sx={{ 
      height: "24px", 
      width: "114",
      font: "jost",
      fontWeight: "400"
      
      }}
       value="Accra"
      />
      </Box>

      <Button
        disableElevation
        variant="contained"
        fullWidth
        type="button"
        // disabled={!isSearchEnabled}
        sx={{
          height: "48px",
        
          textTransform: "none",
          boxShadow: "none",
          borderRadius: "9px",
          marginTop: "24px",
        }}
        onClick={handleSearch}
      >
        {language.homePassenger.searchButton}
      </Button>
    </Box>
  );
}

export default HomePassenger;

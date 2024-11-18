import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Box } from "@mui/material";
import { BookingCards } from "../components/BookingCards";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import SelectLocation from "../components/SelectLocation";
import HomeCarOwner from "./HomeCarOwner";

function HomePassenger() {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: "0 24px" }}>
      <h1
        className="h2"
        style={{
          paddingTop: "47px",
          textAlign: "center",
          paddingBottom: "20px",
        }}
      >
        Find a
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
          <SelectLocation />
          <Box sx={{}}>
            <Box sx={{ position: "relative", top: "10px" }}>Point de Dépôt</Box>
          </Box>
        </Box>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          sx={{ width: "100%" }}
          label="Sélectionnez l’heure du Départ "
          //value={value}
          //onChange={(newValue) => setValue(newValue)}
          //renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <BookingCards />
      <Button
        disableElevation
        variant="contained"
        fullWidth // Apply fullWidth to make button span the full width
        type="submit" // Set the type to "submit" for form submission
        sx={{
          height: "47px",
          textTransform: "none",
          boxShadow: "none",
          borderRadius: "9px",
          marginTop: "24px",
        }}
        onClick={() => {
          navigate("/available-routes");
        }}
      >
        Rechercher
      </Button>
    </Box>
  );
}

export default HomePassenger;

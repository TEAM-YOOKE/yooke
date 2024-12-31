import React from "react";
import { Box, TextField, Chip, Autocomplete } from "@mui/material";
import GoogleMapSearchMultiple from "./inputs/GoogleMapSearchMultiple";

const stopPointsList = [
  "Carrefour Obili",
  "Carrefour Biyem-Assi",
  "Carrefour Essos",
  "Carrefour Mvan",
  "Carrefour Bastos",
  "Carrefour Tsinga",
  "Carrefour Elig-Essono",
  "Carrefour Nlongkak",
  "Carrefour Mokolo",
  "Carrefour Emana",
  "Carrefour Ekounou",
  "Carrefour Nsam",
  "Carrefour Tam-Tam",
  "Carrefour Titi-Garage",
  "Carrefour Tsinga",
  "Carrefour Ahala",
  "Carrefour Nkolmesseng",
  "Carrefour Messassi",
  "Carrefour MEEC",
  "Carrefour Olezoa",
  "Carrefour Warda",
  "Carrefour Kennedy",
  "Carrefour Yaoundé II",
  "Carrefour GP",
  "Total Biyem-Assi",
  "Total Emana",
  "Total Mvog-Betsi",
  "Total Melen",
  "Total Bastos",
  "Total Tsinga",
  "Marché Mokolo",
  "Marché Mfoundi",
  "Marché Madagascar",
  "Marché Central",
  "Marché Acacia",
  "Marché Essos",
  "Marché Biyem-Assi",
  "Marché Etoudi",
  "Quartier Bastos",
  "Quartier Elig-Essono",
  "Quartier Melen",
  "Quartier Mbankolo",
  "Quartier Obili",
  "Quartier Nlongkak",
  "Yoyo Bar",
];

const StopPoints = ({ value, onChange }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <GoogleMapSearchMultiple
        options={stopPointsList}
        value={value}
        onChange={onChange}
      />
      <Autocomplete
        multiple
        id="tags-filled"
        options={stopPointsList}
        freeSolo
        value={value}
        onChange={(event, newValue) => {
          onChange(newValue);
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Stop Points"
            placeholder="Select or type stop points"
          />
        )}
      />
    </Box>
  );
};

export default StopPoints;

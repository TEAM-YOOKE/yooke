import { Autocomplete, Button, Card, TextField, Typography } from "@mui/material";
import React from "react";
import { PEOPLE, RECURRING_RIDES } from "../constants";

const PeopleWithoutRidesCard = ({ person, cars, handleCarChange }) => {
  return (
    <Card
      sx={{
        border: "1px solid #33bdbd",
        borderRadius: 2,
        backgroundColor: "#f0fbfb",
        boxShadow: 3,
        padding: 1,
        cursor: "pointer",
        width: "100%",
      }}
    >
      <Typography variant="body1" fontWeight="bold">
        {person.name}
      </Typography>
      <Typography variant="body2">{person.email}</Typography>

      <Autocomplete
      
        disablePortal
        options={cars}
        getOptionLabel={(option) => option.plate + " " + option.model}
        onChange={handleCarChange}
        sx={{ width: 300, my:1 }}
        renderInput={(params) => (
          <TextField name="car" {...params} label="Select Car" />
        )}
      />
       <Button
          variant="contained"
          type="button"
          sx={{
            textTransform: "none",
            boxShadow: "none",
            borderRadius: "9px",
          }}
        >
          Add to ride
        </Button>
    </Card>
  );
};

export default PeopleWithoutRidesCard;

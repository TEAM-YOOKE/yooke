import { Box, TextField } from "@mui/material";
import React from "react";

const SearchField = ({ searchQuery, onSearchChange, label }) => {
  return (
    <Box sx={{ m: 2 }}>
      <TextField
        variant="outlined"
        label={label}
        fullWidth
        type="search"
        value={searchQuery}
        onChange={onSearchChange}
      />
    </Box>
  );
};
export default SearchField;

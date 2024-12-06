import { Box, Chip } from "@mui/material";
import React from "react";

const FilterChips = ({ selectedFilter, onFilterChange }) => {
  const filters = ["All", "Car owner", "Passenger"];

  return (
    <Box sx={{ m: 2, display: "flex", gap: 1 }}>
      {filters.map((filter) => (
        <Chip
          key={filter}
          label={filter}
          color={selectedFilter === filter ? "primary" : "default"}
          onClick={() => onFilterChange(filter)}
        />
      ))}
    </Box>
  );
};

export default FilterChips;

import { Box, CircularProgress } from "@mui/material";
import React from "react";

const CircularProgressLoading = () => {
  return (
    <Box
      sx={{
        height: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default CircularProgressLoading;

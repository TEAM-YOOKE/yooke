import React from "react";
import { Box, Tabs, Tab } from "@mui/material";

const PassengerConnectionsNav = ({ value, setValue }) => {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="rounded tabs example"
        TabIndicatorProps={{
          style: { display: "none" }, // Removes the underline
        }}
        sx={{
          "& .MuiTabs-flexContainer": {
            justifyContent: "center",
          },
        }}
      >
        {["Active Ride", "History"].map((label, index) => (
          <Tab
            key={index}
            label={label}
            sx={{
              borderRadius: "25px",
              border: "1px solid #22CEA6",
              marginRight: 2,
              px: 2,
              fontSize: "13px",
              bgcolor: value === index ? "secondary.main" : "transparent",
              color: value === index ? "#fff !important" : "#22CEA6",
              "&:hover": {
                bgcolor: value === index ? "secondary.main" : "action.hover",
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default PassengerConnectionsNav;

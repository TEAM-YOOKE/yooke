import React, { useState } from "react";

import Box from "@mui/material/Box";

import AdminUsersList from "./AdminUsersList";
import AdminAddNew from "./AdminAddNew";
import WaitingList from "./WaitingList";
import RecurringRides from "./RecurringRides";
import Calendar from "./Calendar";
import Cars from "./Cars";
import AdminNavbar from "../components/navbars/AdminNavbar";

function Admin() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          // position: "fixed",
          // top: 0,
          // left: 0,
          width: "100%",
          backgroundColor: "#fff",
          zIndex: 1,
        }}
      >
        <AdminNavbar handleTabChange={handleTabChange} tabValue={tabValue} />
        <Box
          sx={{
            overflowY: "auto",
          }}
        >
          {tabValue === 0 && <AdminUsersList />}
          {tabValue === 1 && <WaitingList />}
          {tabValue === 2 && <Cars />}
          {tabValue === 3 && <RecurringRides />}
          {tabValue === 4 && <Calendar />}
        </Box>
      </Box>
    </>
  );
}

export default Admin;

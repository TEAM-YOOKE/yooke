import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useAuth } from "../helpers/GeneralContext";
import { LanguageContext } from "../helpers/LanguageContext";
import { useNavigate } from "react-router-dom";
import AdminUsersList from "./AdminUsersList";
import AdminAddNew from "./AdminAddNew";
import WaitingList from "./WaitingList";
import RecurringRides from "./RecurringRides";
import Calendar from "./Calendar";

function Admin() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [tabValue, setTabValue] = useState(0);

  const { currentUser, logout } = useAuth();
  const { language } = useContext(LanguageContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate("/admin");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#fff",
          zIndex: 1,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" component="div">
                Yooke Admin
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body1">
                  {currentUser?.email || language.email}
                </Typography>
                <IconButton
                  onClick={handleLogout}
                  disabled={loading}
                  color="inherit"
                >
                  {loading ? <CircularProgress size={24} /> : <ExitToAppIcon />}
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
        </Box>

        {/* Tabs for switching between "Accounts" and "Waiting List" */}
        <Box
          sx={{
            padding: "16px 16px 0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Accounts" />
              <Tab label="Waiting List" />
              <Tab label="Cars" />
              <Tab label="Recurring Rides" />
              <Tab label="Calendar" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
            >
              Add New
            </Button>
          )}
        </Box>

        {/* Conditionally render SearchField only when tabValue is 0 (Accounts tab) */}
        {tabValue === 0 && (
          <SearchField
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        )}

        <Box
          sx={{
            height: "calc(100vh - 200px)", // Adjust height to allow scrolling
            overflowY: "auto",
          }}
        >
          {tabValue === 0 && (
            <>
              <FilterChips
                selectedFilter={selectedFilter}
                onFilterChange={handleFilterChange}
              />
              <AdminUsersList
                searchQuery={searchQuery}
                accountType={selectedFilter}
              />
            </>
          )}
          {tabValue === 1 &&  (
            <WaitingList searchQuery={searchQuery} />
          )}
          {
            tabValue === 2 && (
              <Cars />
            )
          }
          {
            tabValue === 3 && (
              <RecurringRides searchQuery={searchQuery} />
            )
          }
          {
            tabValue === 4 && 
              <Calendar searchQuery={searchQuery} />
          }
        </Box>
        <AdminAddNew open={open} handleClose={handleClose} />
      </Box>
    </>
  );
}

// SearchField component for searching accounts
const SearchField = ({ searchQuery, onSearchChange }) => {
  return (
    <Box sx={{ m: 2 }}>
      <TextField
        variant="outlined"
        label="Search by email or company"
        fullWidth
        type="search"
        value={searchQuery}
        onChange={onSearchChange}
      />
    </Box>
  );
};

// FilterChips component for filtering accounts
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

export default Admin;

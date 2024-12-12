import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import CarCard from "../components/CarCard";
import { db } from "../firebase-config";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import RefreshIcon from "@mui/icons-material/Refresh";
import CarForm from "../components/dialogs/CarForm";
import YookePagination from "../components/navbars/Pagination";
import SearchField from "../components/inputs/SearchField";
import CircularProgressLoading from "../components/feedbacks/CircularProgressLoading";
import useCars from "../hooks/cars";
function Cars() {
  // const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [openCarForm, setOpenCarForm] = useState(false);
  // const [carsLoading, setCarsLoading] = useState(false);
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [pageNumber, setPageNumber] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const { cars, refreshCars, carsLoading } = useCars();

  const carsPerPage = 6;

  // Apply filters and search query when data or filter changes
  useEffect(() => {
    const filtered = cars.filter((car) => {
      const matchesSearchQuery =
        car.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model?.toLowerCase().includes(searchQuery.toLowerCase());

      // const matchesAccountType =
      //   selectedFilter === "All" || user.accountType === selectedFilter;

      return matchesSearchQuery;
    });

    setFilteredCars(filtered);
    setPageNumber(1); // Reset to the first page when filters change
  }, [cars, searchQuery]);

  // const fetchCars = async () => {
  //   try {
  //     setCarsLoading(true);
  //     const q = query(collection(db, "cars"));
  //     const querySnapshot = await getDocs(q);
  //     const carsData = querySnapshot.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }));
  //     setCars(carsData);
  //   } catch (error) {
  //     console.log("Error fetching cars", error);
  //   } finally {
  //     setCarsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchCars();
  // }, []);

  const handleSelectedCar = (car) => {
    setSelectedCar(car);
  };

  const handleClickOpenCarForm = (user) => {
    setSelectedCar(user);
    setOpenCarForm(true);
  };

  const handleCloseCarForm = (user) => {
    setSelectedCar(null);
    setOpenCarForm(false);
  };

  const handleDeleteCar = async (carId) => {
    if (window.confirm("Are you sure you want to delete car?")) {
      try {
        await deleteDoc(doc(db, "cars", carId));
        refreshCars();
      } catch (error) {
        console.error("Error deleting car: ", error);
      }
    }
  };

  // Handle pagination logic
  const startIndex = (pageNumber - 1) * carsPerPage;
  const currentCars = filteredCars.slice(startIndex, startIndex + carsPerPage);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const buttonStyles = {
    backgroundColor: "#001023",
    color: "#fff",
    "&:hover": { backgroundColor: "#333" },
  };

  return (
    <Box>
      <Grid container spacing={8} sx={{ paddingX: 4 }}>
        {/* List of Cars */}
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            {/* <Typography variant="h6">Available Cars</Typography> */}
            {/* // refresh icon */}
            <Box flexGrow={1}>
              <SearchField
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                label="Search by plate, model or diver name "
              />
            </Box>
            <Button
              onClick={() => refreshCars()}
              variant="outlined"
              color="primary"
              size="small"
              aria-label="Refresh cars"
            >
              <RefreshIcon />
            </Button>
          </Box>

          {carsLoading ? (
            <CircularProgressLoading />
          ) : currentCars && currentCars.length ? (
            currentCars.map((car, index) => (
              <CarCard
                key={index}
                my={1}
                car={car}
                handleDeleteCar={handleDeleteCar}
                handleClickOpenCarForm={handleClickOpenCarForm}
                handleCloseAccountForm={handleCloseCarForm}
                showPassengers={true}
              />
            ))
          ) : (
            <Typography variant="body2">No cars available</Typography>
          )}
        </Grid>
      </Grid>

      <YookePagination
        page={pageNumber}
        count={totalPages}
        onChange={(e, page) => setPageNumber(page)}
      />

      <CarForm
        open={openCarForm}
        handleClose={handleCloseCarForm}
        car={selectedCar}
      />
    </Box>
  );
}

export default Cars;

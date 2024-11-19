import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

function Cars() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    plate: "",
    model: "",
    driverName: "",
    driverPhone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddCar = () => {
    if (form.plate && form.model && form.driverName && form.driverPhone) {
      setCars([...cars, form]);
      setForm({ plate: "", model: "", driverName: "", driverPhone: "" });
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={4}>
        {/* List of Cars */}
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6"></Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#001023",
                color: "#fff",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              Add new car
            </Button>
          </Box>
          {cars.map((car, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body1">
                  <strong>Plate:</strong> {car.plate}
                </Typography>
                <Typography variant="body1">
                  <strong>Model:</strong> {car.model}
                </Typography>
                <Typography variant="body1">
                  <strong>Driver Name:</strong> {car.driverName}
                </Typography>
                <Typography variant="body1">
                  <strong>Driver Phone:</strong> {car.driverPhone}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* Add Car Form */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" mb={2}>
            
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Plate"
              variant="outlined"
              name="plate"
              value={form.plate}
              onChange={handleInputChange}
            />
            <TextField
              label="Model"
              variant="outlined"
              name="model"
              value={form.model}
              onChange={handleInputChange}
            />
            <TextField
              label="Driver Name"
              variant="outlined"
              name="driverName"
              value={form.driverName}
              onChange={handleInputChange}
            />
            <TextField
              label="Driver Phone"
              variant="outlined"
              name="driverPhone"
              value={form.driverPhone}
              onChange={handleInputChange}
            />
            <Button
              variant="contained"
              onClick={handleAddCar}
              sx={{
                backgroundColor: "#001023",
                color: "#fff",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              Add
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Cars;

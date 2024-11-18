import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

const CarImages = ({ value, onChange }) => {
  const handleImageChange = (index, newUrl) => {
    const newImages = [...value];
    newImages[index] = newUrl;
    onChange(newImages);
  };

  const handleAddImage = () => {
    onChange([...value, ""]);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Car Images
      </Typography>
      {value.map((image, index) => (
        <TextField
          key={index}
          label={`Car Image ${index + 1}`}
          fullWidth
          margin="normal"
          variant="outlined"
          color="secondary"
          value={image}
          onChange={(e) => handleImageChange(index, e.target.value)}
        />
      ))}
      <Button onClick={handleAddImage} sx={{ mt: 2 }}>
        Add Image
      </Button>
    </Box>
  );
};

export default CarImages;

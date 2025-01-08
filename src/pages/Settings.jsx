import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Grid,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useAuth } from "../helpers/GeneralContext";
import { LanguageContext } from "../helpers/LanguageContext";

const Settings = () => {
  const { currentUser, updateUser } = useAuth();
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  console.log(currentUser);

  const [name, setName] = useState(currentUser?.username || "");
  const [numberPlate, setNumberPlate] = useState(currentUser?.carPlate || "");
  const [slots, setSlots] = useState(currentUser?.slots || 4);
  const [phoneNumber, setPhoneNumber] = useState(
    currentUser?.whatsappNumber || ""
  );
  const [carImages, setCarImages] = useState(currentUser?.carImages || []);
  const [changesMade, setChangesMade] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(currentUser?.username || "");
    setPhoneNumber(currentUser?.whatsappNumber || "");
    setNumberPlate(currentUser?.carPlate || "");
    setSlots(currentUser?.slots || 4);
    setCarImages(currentUser?.carImages || []);
  }, [currentUser]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setCarImages(files);
    setChangesMade(true);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const userDocRef = doc(db, "accounts", currentUser.docId);
      const storage = getStorage();
      const imageUrls = [];

      if (carImages.some((image) => typeof image !== "string")) {
        for (const file of carImages) {
          if (typeof file !== "string") {
            const storageRef = ref(
              storage,
              `car-images/${currentUser.uid}/${file.name}`
            );
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            imageUrls.push(downloadURL);
          } else {
            imageUrls.push(file);
          }
        }
      }

      await updateDoc(userDocRef, {
        username: name,
        carPlate: numberPlate,
        slots: slots,
        whatsappNumber: phoneNumber,
        carImages: imageUrls.length ? imageUrls : carImages,
      });
      setChangesMade(false);
      await updateUser(currentUser.email); // Refresh the user data in context
    } catch (error) {
      console.error("Error updating user data:", error);
      setError(language.settings.updateError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">{language.accountSettings}</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: "0 24px" }}>
        <TextField
          label={language.name}
          fullWidth
          margin="normal"
          variant="outlined"
          color="secondary"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setChangesMade(true);
          }}
        />
        <TextField
          label={language.phoneNumber}
          fullWidth
          margin="normal"
          variant="outlined"
          color="secondary"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
            setChangesMade(true);
          }}
          helperText={language.settings.phoneNumberHelper}
        />

        {currentUser.accountType === "Car owner" && (
          <Box>
            <Box sx={{ my: 2 }}>
              <TextField
                label={language.numberPlate}
                fullWidth
                margin="normal"
                variant="outlined"
                color="secondary"
                value={numberPlate}
                onChange={(e) => {
                  setNumberPlate(e.target.value);
                  setChangesMade(true);
                }}
              />
              <TextField
                label={language.slots}
                fullWidth
                margin="normal"
                variant="outlined"
                color="secondary"
                value={slots}
                onChange={(e) => {
                  setSlots(e.target.value);
                  setChangesMade(true);
                }}
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <Button
                variant="contained"
                component="label"
                disableElevation
                sx={{ borderRadius: "9px" }}
              >
                {language.settings.uploadCarImages}
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ my: 2 }}>
                {error}
              </Alert>
            )}

            {carImages.length > 0 && (
              <Box sx={{ mt: 2, width: "100%" }}>
                <Typography variant="h6">
                  {language.settings.preview}
                </Typography>
                <Grid container spacing={2}>
                  {carImages.map((image, index) => (
                    <Grid item key={index}>
                      <Avatar
                        src={
                          typeof image === "string"
                            ? image
                            : URL.createObjectURL(image)
                        }
                        variant="rounded"
                        sx={{ width: 100, height: 100 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        )}

        {changesMade && (
          <Button
            disableElevation
            variant="contained"
            fullWidth
            sx={{
              height: "47px",
              textTransform: "none",
              boxShadow: "none",
              borderRadius: "9px",
              marginTop: "24px",
            }}
            onClick={handleSaveChanges}
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} /> : language.saveChanges}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Settings;

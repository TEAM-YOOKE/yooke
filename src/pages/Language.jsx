import React, { useContext } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../helpers/LanguageContext";

const Language = () => {
  const navigate = useNavigate();
  const { languageCode, changeLanguage, language } =
    useContext(LanguageContext);

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
  };

  return (
    <Box>
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">{language.languageSettings}</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 2 }}>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="language"
            name="language"
            value={languageCode}
            onChange={handleLanguageChange}
          >
            <FormControlLabel
              value="en"
              control={<Radio />}
              label={language.english}
            />
            <FormControlLabel
              value="fr"
              control={<Radio />}
              label={language.french}
            />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Language;

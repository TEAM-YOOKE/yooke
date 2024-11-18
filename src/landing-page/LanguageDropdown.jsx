import React, { useState, useContext } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import { LanguageContext } from "../helpers/LanguageContext"; // Access the LanguageContext

const LanguageDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null); // Manages dropdown open/close state
  const { changeLanguage, languageCode, language } =
    useContext(LanguageContext); // Access the current language and changeLanguage function

  // Opens the dropdown menu
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Closes the dropdown menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Changes the language and closes the dropdown
  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    handleClose();
  };

  return (
    <div>
      <Button
        aria-controls="language-menu"
        aria-haspopup="true"
        onClick={handleOpen} // Opens the dropdown menu
        sx={{
          textTransform: "none",
          fontWeight: "medium",
          fontSize: "18px",
          color: "#fff",
        }}
      >
        <img
          src="/language-icon.svg"
          style={{ marginRight: "4px" }}
          alt="Language Icon"
        />
        {language.language} {/* Display the current language label */}
      </Button>

      {/* Dropdown Menu */}
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => handleLanguageChange("en")}
          selected={languageCode === "en"} // Highlight the selected language
        >
          <img
            src="https://flagcdn.com/w20/gb.png"
            alt="English"
            style={{ marginRight: "8px" }}
          />
          English
        </MenuItem>
        <MenuItem
          onClick={() => handleLanguageChange("fr")}
          selected={languageCode === "fr"} // Highlight the selected language
        >
          <img
            src="https://flagcdn.com/w20/fr.png"
            alt="Français"
            style={{ marginRight: "8px" }}
          />
          Français
        </MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageDropdown;

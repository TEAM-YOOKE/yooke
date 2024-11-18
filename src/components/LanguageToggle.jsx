import React, { useContext } from "react";
import { LanguageContext } from "../helpers/LanguageContext";

const LanguageToggle = () => {
  // Access the language context
  const { language, languageCode, changeLanguage } =
    useContext(LanguageContext);

  // Function to toggle between languages
  const toggleLanguage = () => {
    const newLanguageCode = languageCode === "en" ? "fr" : "en";
    changeLanguage(newLanguageCode);
  };

  return (
    <button onClick={toggleLanguage}>
      {languageCode === "en" ? "Switch to French" : "Switch to English"}
    </button>
  );
};

export default LanguageToggle;

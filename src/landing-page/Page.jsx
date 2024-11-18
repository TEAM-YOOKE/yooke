import { Box } from "@mui/material";
import LanguageDropdown from "./LanguageDropdown";
import AnimatedButton from "./AnimatedButton";
import { useMediaQuery, useTheme } from "@mui/material";
import { Button } from "@mui/material";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { useContext, useRef } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { LanguageContext } from "../helpers/LanguageContext"; // Import the LanguageContext
import React, { useState } from "react";
import { Snackbar, CircularProgress, Alert } from "@mui/material";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase-config"; // Adjust the import path to your firebase config

export default function Page() {
  const { language, languageCode } = useContext(LanguageContext); // Access the translations
  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "#101012",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            zIndex: 1,
            position: "relative",
          }}
        >
          <Box
            component="img"
            sx={{ position: "absolute", maxWidth: "100%" }}
            src="/hero-illustration.svg"
          />
        </Box>
        <Box sx={{ zIndex: 2, position: "relative" }}>
          <Header />
          <Hero />
        </Box>
      </Box>
      <Box
        sx={{
          display: {
            xs: "block",
            lg: "none",
            textAlign: "center",
            margin: "24px",
            borderRadius: "16px",
            overflow: "hidden",
            // this is the mobile only section 4 multicolored
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: "#FE6869",
            color: "#000",
            padding: "24px 17px 28px 17px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img src="partnersvg.svg" />
          </Box>
          <h5
            style={{
              fontSize: "18px",
              lineHeight: "27px",
              marginBottom: "8px",
              marginTop: "8px",
            }}
          >
            {language.landingPage.partnerCompanies}
          </h5>
          <p style={{ fontSize: "18px", lineHeight: "22px" }}>
            {" "}
            {language.landingPage.partnerCompaniesBody}
          </p>
        </Box>
        <Box
          sx={{
            backgroundColor: "#C5D8C5",
            color: "#000",
            padding: "24px 17px 28px 17px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img src="passengersvg.svg" />
          </Box>
          <h5
            style={{
              fontSize: "18px",
              lineHeight: "27px",
              marginBottom: "8px",
              marginTop: "8px",
            }}
          >
            {language.landingPage.passengers}
          </h5>
          <p style={{ fontSize: "18px", lineHeight: "22px" }}>
            {" "}
            {language.landingPage.passengersBody}
          </p>
        </Box>
        <Box
          sx={{
            backgroundColor: "#E9E9E9",
            color: "#000",
            padding: "24px 17px 28px 17px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img src="vehicleownerssvg.svg" />
          </Box>
          <h5
            style={{
              fontSize: "18px",
              lineHeight: "27px",
              marginBottom: "8px",
              marginTop: "8px",
            }}
          >
            {language.landingPage.vehicleOwners}
          </h5>
          <p style={{ fontSize: "18px", lineHeight: "22px" }}>
            {" "}
            {language.landingPage.vehicleOwnersBody}
          </p>
        </Box>
        <Box
          sx={{
            backgroundColor: "#C5D8C5",
            color: "#000",
            padding: "24px 17px 28px 17px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img src="friendlinesssvg.svg" />
          </Box>
          <h5
            style={{
              fontSize: "18px",
              lineHeight: "27px",
              marginBottom: "8px",
              marginTop: "8px",
            }}
          >
            {language.landingPage.friendliness}
          </h5>
          <p style={{ fontSize: "18px", lineHeight: "22px" }}>
            {" "}
            {language.landingPage.friendlinessBody}
          </p>
        </Box>
      </Box>
      <WaitingLisAndFooter />
    </Box>
  );
}

function WaitingLisAndFooter() {
  const { language } = useContext(LanguageContext); // Access the translations
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

  // Email validation with regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async () => {
    if (!emailRegex.test(email)) {
      setSnackbarMessage("Please enter a valid email address.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      // Save email to Firebase 'waitinglist' collection with a timestamp
      await addDoc(collection(db, "waitinglist"), {
        email,
        date: Timestamp.now(),
      });

      setSnackbarMessage("Email submitted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setEmail(""); // Clear the input after submission
    } catch (error) {
      setSnackbarMessage("Failed to submit email. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ background: "linear-gradient(to bottom, #fff, #A9ECDC)" }}
      id="waiting-list-section"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: { xs: "24px", lg: "64px" },
          padding: { xs: "0 24px 24px 24px", lg: 0 },
        }}
      >
        <Box
          sx={{
            padding: "48px 24px",
            width: "100%",
            display: { xs: "grid", lg: "grid" },
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            position: "relative",
            maxWidth: "1110px",
            overflow: "hidden",
            borderRadius: "16px",
          }}
        >
          <Box
            component="img"
            src={
              isXs
                ? "bg-sub-mobile.svg"
                : isLg
                ? "bg-sub.svg"
                : "bg-sub-mobile.svg"
            }
            sx={{ position: "absolute", maxWidth: "100%", zIndex: "1" }}
          />
          <Box sx={{ display: "flex", justifyContent: "center", zIndex: "2" }}>
            <Box
              component="img"
              src="/waitlist-illustration.svg"
              sx={{ width: { xs: "100px", lg: "175px" } }}
            />
          </Box>
          <Box sx={{ zIndex: "2" }}>
            <Box
              component="h2"
              sx={{
                color: "#fff",
                fontSize: {
                  xs: "26px",
                  lg: "40px",
                },
                lineHeight: { xs: "", lg: "48px" },
                letterSpacing: { xs: "", lg: "-2.5px" },
                fontWeight: "semi-bold",
                textAlign: { xs: "center", lg: "left" },
                marginBottom: "32px",
                maxWidth: "445px",
              }}
            >
              {language.landingPage.joinWaitingList}
            </Box>
            <Box sx={{ display: { xs: "grid", lg: "flex" } }}>
              <Box
                component="input"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="name@example.com"
                sx={{
                  border: 0,
                  borderRadius: "80px",
                  padding: "0 40px 0 20px",
                  marginRight: "2px",
                  height: "63.59px",
                  marginBottom: { xs: "16px", lg: 0 },
                }}
              />
              <button
                className="shiny-cta"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "..." : language.landingPage.joinWaitingListButton}
              </button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Add back road images */}
      <Box
        component="img"
        src="/road.png"
        sx={{ maxWidth: "100%", display: { xs: "none", lg: "block" } }}
      />
      <Box
        component="img"
        src="/road-mobile.png"
        sx={{ maxWidth: "100%", display: { xs: "block", lg: "none" } }}
      />

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function Hero() {
  const { language, languageCode } = useContext(LanguageContext); // Access the translations
  const navigate = useNavigate();
  const waitingListRef = useRef(null); // Reference to the waiting list section

  const handleScrollToWaitingList = () => {
    const waitingListSection = document.getElementById("waiting-list-section");
    if (waitingListSection) {
      waitingListSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  // Conditional image sources based on the selected language
  const heroImageSrc =
    languageCode === "fr" ? "/hero-img-fr.png" : "/hero-img-en.png";
  const heroImageMobileSrc =
    languageCode === "fr"
      ? "/hero-img-mobile-fr.png"
      : "/hero-img-mobile-en.png";

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: { xs: "40px", lg: "64px" },
        }}
      >
        <Box sx={{ maxWidth: "800px" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                display: "flex",
                color: "#000",
                backgroundColor: "#22CEA6",
                padding: "4px",
                borderRadius: "40px",
                alignItems: "center",
                paddingRight: "15px",
              }}
            >
              <Box
                sx={{
                  padding: "4px 8px",
                  border: "2px solid rgba(0,0,0,.1)",
                  borderRadius: "40px",
                  marginRight: "13px",
                }}
              >
                {language.landingPage.pilotPhase} {/* Using the translation */}
              </Box>
              {language.landingPage.beOneOfTheFirst}{" "}
              {/* Using the translation */}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "0 24px",
            }}
          >
            <Box
              component="h1"
              sx={{
                fontSize: {
                  xs: "30px",
                  lg: "60px",
                },
                lineHeight: { xs: "", lg: "70px" },
                letterSpacing: { xs: "", lg: "-2.5px" },
                textAlign: "center",
                marginTop: "16px",
                color: "rgba(255,255,255,.87)",
                fontWeight: "semi-bold",
              }}
            >
              {language.landingPage.secureCarpooling}{" "}
              {/* Using the translation */}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "0 24px",
            }}
          >
            <Box
              component="p"
              sx={{
                maxWidth: "650px",
                fontSize: {
                  xs: "16px",
                  lg: "19px",
                },
                lineHeight: { xs: "", lg: "29px" },
                textAlign: "center",
                marginTop: "20px",
                color: "rgba(255,255,255,.87)",
              }}
            >
              {language.landingPage.streamlineCommute}{" "}
              {/* Using the translation */}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "49px",
            }}
          >
            {/* Login button */}
            <Box
              component="button"
              sx={{
                fontWeight: "medium",
                fontSize: "18px",
                padding: "8px 34px",
                backgroundColor: "#fff",
                color: "#000",
                borderRadius: "42px",
                cursor: "pointer",
                display: { md: "block" },
                marginRight: "4px",
                border: 0,
              }}
              onClick={handleLoginClick}
            >
              {language.landingPage.login} {/* Using the translation */}
            </Box>

            {/* Join Waiting List button */}
            <button className="shiny-cta" onClick={handleScrollToWaitingList}>
              {language.landingPage.joinWaitingListButton}{" "}
              {/* Using the translation */}
            </button>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          component="img"
          src={heroImageSrc}
          sx={{
            width: "100%",
            maxWidth: "1500px",
            display: { xs: "none", lg: "block" },
          }}
        />
        <Box
          component="img"
          src={heroImageMobileSrc}
          sx={{
            width: "100%",
            maxWidth: "1500px",
            display: { xs: "block", lg: "none" },
          }}
        />
      </Box>
    </>
  );
}

function Header() {
  const { language } = useContext(LanguageContext); // Access the translations
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: { xs: "center", lg: "none" },
        padding: "23px 32px",
      }}
    >
      <Box
        component="img"
        src="/white-logo-website.png"
        sx={{
          width: { xs: "64px", lg: "79px" },
          height: "100%",
        }}
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <LanguageDropdown />
        <Box
          component="button"
          sx={{
            fontWeight: "medium",
            fontSize: "18px",
            padding: "8px 34px",
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "42px",
            cursor: "pointer",
            marginLeft: "46px",
            display: { xs: "none", md: "block" },
          }}
          onClick={handleLoginClick}
        >
          {language.landingPage.login} {/* Using the translation */}
        </Box>
      </Box>
    </Box>
  );
}

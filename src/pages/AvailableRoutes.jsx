import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/system";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AvailableRoutesList } from "../components/AvailableRoutesList";
import { AvailableRoutesContext } from "../helpers/AvailableRoutesContext";
import { LanguageContext } from "../helpers/LanguageContext";

export default function AvailableRoutes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pickup = searchParams.get("pickup");
  const dropoff = searchParams.get("dropoff");
  const time = searchParams.get("time");
  const seats = searchParams.get("seats");

  const { cachedSearches, setAvailableRoutes } = useContext(
    AvailableRoutesContext
  );

  const { language } = useContext(LanguageContext);

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formattedTime = formatTime(time);

  useEffect(() => {
    const cacheKey = `${pickup}-${dropoff}-${time}-${seats}`;

    if (cachedSearches[cacheKey]) {
      setAvailableRoutes(cachedSearches[cacheKey]);
    } else {
      setAvailableRoutes(null); // This will trigger a new fetch in AvailableRoutesList
    }
  }, [pickup, dropoff, time, seats, cachedSearches, setAvailableRoutes]);

  const handleRouteClick = (route) => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchTime = searchParams.get("time");

    navigate(`/app/your-path/${route.id}/${seats}/${searchTime}`);
  };

  return (
    <Box>
      <Box
        sx={{
          position: "fixed",
          zIndex: 1,
          top: 0,
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(25px)",
          width: "100%",
        }}
      >
        <AppBar
          sx={{
            position: "relative",
            background: "transparent",
            color: "#000",
            boxShadow: "none",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Box sx={{ position: "absolute", left: "16px", top: "4px" }}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  window.history.back();
                }}
                aria-label="close"
              >
                <ArrowBackIosIcon />
              </IconButton>
            </Box>
            <Box>
              <Typography
                sx={{ textAlign: "center", marginTop: "8px" }}
                variant="h6"
                component="div"
              >
                {language.availableRoutes.topMatches}
              </Typography>
            </Box>
          </Box>
        </AppBar>
        <Box
          sx={{
            display: "grid",
            borderBottom: "1px solid #C4C4C4",
            gridTemplateColumns: "40px 1fr 1fr",
            padding: "24px 0 20px 0",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateRows: "16px 14px 16px",
              marginLeft: "12px",
            }}
          >
            <Box
              sx={{
                width: "16px",
                height: "16px",
                border: "4px solid #39B54A",
                borderRadius: "16px",
              }}
            ></Box>
            <Box
              sx={{ borderLeft: "1px dashed #C4C4C4", marginLeft: "8px" }}
            ></Box>
            <Box
              sx={{
                width: "16px",
                height: "16px",
                border: "4px solid #FF0000",
                borderRadius: "16px",
              }}
            ></Box>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateRows: "1fr 1fr",
              "& > div": { display: "flex", color: "rgba(0, 0, 0, .7)" },
            }}
          >
            <Box sx={{}}>
              <Box sx={{ position: "relative", top: "-3px" }}>{pickup}</Box>
            </Box>
            <Box sx={{}}>
              <Box sx={{ position: "relative", top: "2.5px" }}>{dropoff}</Box>
            </Box>
          </Box>
          <Box
            sx={{
              "& > div": {
                display: "flex",
                alignItems: "center",
                "& > svg": { marginRight: "16px" },
              },
              color: "rgba(0, 0, 0, .7)",
            }}
          >
            <Box sx={{ position: "relative", top: "-3px" }}>
              <ScheduleOutlinedIcon sx={{ fontSize: "19px" }} />
              <div>{formattedTime}</div>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ height: "133px" }} />
      <AvailableRoutesList
        pickup={pickup}
        dropoff={dropoff}
        time={time}
        seats={seats}
        onRouteClick={handleRouteClick}
      />
    </Box>
  );
}

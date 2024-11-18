import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const MobileOnlyRoute = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 680);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 680);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Allow the landing page to be shown on all devices
  if (
    !isMobile &&
    location.pathname !== "/admin" &&
    location.pathname !== "/"
  ) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box component="img" src="qr-code.svg" sx={{ width: "180px" }} />
          </Box>
          This web app is only available on Mobile Devices.
          <br />
          Please <b>scan the QR code</b> to open
        </div>
      </div>
    );
  }

  return children;
};

export default MobileOnlyRoute;

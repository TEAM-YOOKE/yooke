import React from "react";
import { Box } from "@mui/material";

function Wallet() {
  return (
    <div>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <img
          src="/wallet-page.png"
          style={{ maxWidth: "90%", marginTop: "24px" }}
        />
      </Box>
    </div>
  );
}

export default Wallet;

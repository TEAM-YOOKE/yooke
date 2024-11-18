import React from "react";
import { useAuth } from "../helpers/GeneralContext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Login from "../pages/Login";

const carSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="rgba(100, 221, 193, .6)">
  <path d="M5.23 18v1.5q0 .213-.143.356T4.731 20H4.5q-.213 0-.356-.144T4 19.5v-7.346L5.985 6.5q.073-.238.281-.37q.209-.13.465-.13h10.615q.227 0 .413.138t.257.362L20 12.154V19.5q0 .213-.144.356T19.5 20h-.23q-.213 0-.357-.144t-.144-.356V18zm.186-6.846h13.169L17.112 7H6.889zm-.416 1V17zm2.428 3.538q.466 0 .788-.326q.323-.327.323-.794q0-.466-.327-.788q-.327-.323-.793-.323q-.467 0-.79.327q-.321.327-.321.793q0 .467.326.79q.327.321.793.321m9.155 0q.466 0 .788-.326q.322-.327.322-.794q0-.466-.326-.788q-.327-.323-.793-.323q-.467 0-.79.327q-.321.327-.321.793q0 .467.326.79q.327.321.794.321M5 17h14v-4.846H5z"/>
</svg>`;

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (currentUser?.email !== "super.admin@yooke.com") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "rgb(211, 245,237)", // Set background to pure white
          backgroundImage: `
            url("data:image/svg+xml,${encodeURIComponent(carSVG)}")
          `,
          backgroundSize: "40px 40px",
          backgroundRepeat: "repeat",
        }}
      >
        <Box
          sx={{
            padding: "16px",
            borderRadius: "8px",
            boxShadow: 2,
            background: "#fff",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <Login redirectUrl="/admin" /> {/* Pass the admin redirect URL */}
        </Box>
      </Box>
    );
  }

  return children;
};

export default AdminRoute;

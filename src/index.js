import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./index.css";
import Page from "./landing-page/Page";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import AppLayout from "./pages/AppLayout";
import { LanguageProvider } from "./helpers/LanguageContext";
import Home from "./pages/Home";
import AvailableRoutes from "./pages/AvailableRoutes";
import YourPath from "./pages/YourPath";
import Admin from "./pages/Admin";
import MobileOnlyRoute from "./components/MobileOnlyRoute";
import { AuthProvider, useAuth } from "./helpers/GeneralContext";
import FinishAccountSetup from "./pages/FinishAccountSetup";
import Notifications from "./pages/Notifications";
import Connections from "./pages/Connections";
import FullProfile from "./pages/FullProfile";
import Account from "./pages/Account";
import Language from "./pages/Language";
import FAQs from "./pages/FAQs";
import Settings from "./pages/Settings";
import { AvailableRoutesProvider } from "./helpers/AvailableRoutesContext";
import AdminRoute from "./components/AdminRoute";

// ProtectedRoute component to handle login logic and account setup checks
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication status
  if (loading) {
    return <div>Loading...</div>; // Replace with your spinner component
  }

  // If user is not authenticated, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // If user is authenticated but hasn't finished account setup, redirect to account setup
  if (
    !currentUser.accountSetupDone &&
    location.pathname !== "/finish-account-setup"
  ) {
    return <Navigate to="/finish-account-setup" />;
  }

  return children;
};

// Component to show either AppLayout or Login based on user authentication
const AppLayoutOrLogin = () => {
  const { currentUser } = useAuth();

  // If user is not logged in, show the Login page
  if (!currentUser) {
    return <Login />;
  }

  // If the user is logged in, show the AppLayout with the nested routes
  return <AppLayout />;
};

// Create the router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Page />, // The main landing page of the website
  },
  {
    path: "/login", // Protected login page for mobile only
    element: (
      <MobileOnlyRoute>
        <Login /> {/* Mobile-only login page */}
      </MobileOnlyRoute>
    ),
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <MobileOnlyRoute>
          <AppLayoutOrLogin />{" "}
          {/* Show either Login or AppLayout based on authentication */}
        </MobileOnlyRoute>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />, // Default page when accessing /app
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "connections",
        element: <Connections />,
      },
      {
        path: "connections/:connection_id",
        element: <FullProfile />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "available-routes",
        element: <AvailableRoutes />,
      },
      {
        path: "your-path/:rideId/:seats/:searchTime",
        element: <YourPath />,
      },
      {
        path: "full-profile/:id",
        element: <FullProfile />,
      },
      {
        path: "language",
        element: <Language />,
      },
      {
        path: "faqs",
        element: <FAQs />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/finish-account-setup",
    element: (
      <ProtectedRoute>
        <MobileOnlyRoute>
          <FinishAccountSetup />
        </MobileOnlyRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <Admin />
      </AdminRoute>
    ),
  },
]);

// Create the theme for MUI
const theme = createTheme({
  palette: {
    secondary: {
      main: "#22CEA6",
      orange: "#F15A24",
    },
    primary: {
      main: "#001023",
    },
    orange: "#F15A24",
  },
  typography: {
    fontFamily: "'Jost', sans-serif",
  },
});

// Rendering the root element
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LanguageProvider>
        <AuthProvider>
          <AvailableRoutesProvider>
            <CssBaseline />
            <RouterProvider router={router} />
          </AvailableRoutesProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);

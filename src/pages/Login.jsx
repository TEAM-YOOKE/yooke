import React, { useState, useContext, useEffect } from "react";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useLocation } from "react-router-dom";
import { LanguageContext } from "../helpers/LanguageContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { query, where, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase-config";

const Login = ({ redirectUrl }) => {
  // Optional redirectUrl prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  // Determine the fallback redirect URL based on user's role or current path
  const determineRedirectUrl = (userData) => {
    if (redirectUrl) {
      return redirectUrl;
    }

    // Fallback logic: for example, check the user's role or the current route
    if (userData.role === "admin") {
      return "/admin/dashboard";
    }

    if (location.pathname.startsWith("/admin")) {
      return "/admin/dashboard";
    }

    return "/app"; // Default fallback
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const q = query(
        collection(db, "accounts"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        const targetUrl = determineRedirectUrl(userData);
        navigate(targetUrl); // Redirect to the determined URL
      } else {
        setError("User document does not exist.");
      }
    } catch (error) {
      setError("Failed to login. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ padding: "27px 20px" }}>
      <h1 className="h1">Connexion</h1>
      <p className="body1" style={{ marginTop: "2px" }}>
        Entrez vos identifiants pour continuer
      </p>
      <form onSubmit={handleLogin} style={{ marginTop: "44px" }}>
        <TextField
          label="Email"
          id="email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          color="secondary"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <FormControl
          variant="outlined"
          fullWidth
          required
          sx={{ marginTop: "14px" }}
        >
          <InputLabel
            htmlFor="outlined-adornment-password"
            color="secondary"
            sx={{ marginBottom: "8px" }}
          >
            Mot de passe
          </InputLabel>
          <OutlinedInput
            color="secondary"
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Mot de passe"
            disabled={loading}
          />
        </FormControl>
        {error && <Alert severity="error">{error}</Alert>}
        <Button
          disableElevation
          variant="contained"
          fullWidth
          type="submit"
          sx={{
            height: "47px",
            textTransform: "none",
            boxShadow: "none",
            borderRadius: "9px",
            marginTop: "24px",
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Se Connecter"}
        </Button>
      </form>
    </Box>
  );
};

export default Login;

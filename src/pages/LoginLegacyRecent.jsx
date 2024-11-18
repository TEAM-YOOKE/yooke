import React, { useState, useContext } from "react";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../helpers/LanguageContext";
import LanguageToggle from "../components/LanguageToggle";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import LogoutButton from "../components/LogoutButton";
import { query, where, getDocs, collection } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Query the Firestore collection to find the document by email
      const q = query(
        collection(db, "accounts"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        console.log(
          "...user.data():",
          userData,
          "....accid:",
          userData.accountSetupDone
        );

        if (userData.accountSetupDone) {
          navigate("/app"); // Redirect to the main application
        } else {
          navigate("/finish-account-setup"); // Redirect to account setup page
        }
      } else {
        console.error("User document does not exist");
        setError("User document does not exist.");
      }
    } catch (error) {
      console.error("Login error:", error);
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
    <Box sx={{ backgroundColor: "#64DDC1", width: "100vw", height: "100vh" }}>
      <Box></Box>
      <Box
        sx={{ position: "absolute", width: "100%", bottom: "-8px", left: 0 }}
      >
        <Box
          component="img"
          src="city-scape-no-cars.png"
          sx={{ width: "100%", position: "relative", zIndex: 1 }}
        />
        <Box
          component="img"
          src="car1.png"
          sx={{
            width: "18.89%",
            position: "absolute",
            zIndex: 2,
            bottom: 0,
            left: "56%",
          }}
        />
        <Box
          component="img"
          src="car1.png"
          sx={{
            width: "3%",
            position: "absolute",
            zIndex: 2,
            bottom: "125px",
            left: "52%",
          }}
        />
      </Box>
    </Box>
  );

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
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <a
            href="#"
            className="caption grey1-color"
            style={{
              textDecoration: "none",
              marginTop: "4px",
              marginBottom: "44px",
            }}
          >
            {" "}
          </a>
        </Box>

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

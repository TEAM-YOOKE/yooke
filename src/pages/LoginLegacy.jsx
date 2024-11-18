import React, { useContext } from "react";
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
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../helpers/LanguageContext";
import LanguageToggle from "../components/LanguageToggle";

function Login() {
  const [showPassword, setShowPassword] = React.useState(false);

  const { language } = useContext(LanguageContext);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  return (
    <Box sx={{ padding: "27px 20px" }}>
      <h1 className="h1">Connexion</h1>
      <p className="body1" style={{ marginTop: "2px" }}>
        Entrez vos identifiants pour continuer {language.introduction}
        <LanguageToggle />
      </p>
      {/* Login form or content */}
      <form action="" style={{ marginTop: "44px" }}>
        <TextField
          label="Numéro de Téléphone"
          id="phone"
          name="phone"
          type="tel"
          fullWidth
          margin="normal"
          variant="outlined"
          color="secondary"
          required
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
          />
        </FormControl>
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
            Mot de passe oublié
          </a>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "44px",
          }}
        >
          <p className="body1">Se souvenir de moi la prochaine fois</p>
          <Switch defaultChecked color="secondary" />
        </Box>
        <Button
          disableElevation
          variant="contained"
          fullWidth // Apply fullWidth to make button span the full width
          type="submit" // Set the type to "submit" for form submission
          sx={{
            height: "47px",
            textTransform: "none",
            boxShadow: "none",
            borderRadius: "9px",
          }}
          onClick={() => {
            navigate("/app");
          }}
        >
          Se Connecter
        </Button>
      </form>
      <Button
        disableElevation
        variant="text"
        fullWidth // Apply fullWidth to make button span the full width
        type="submit" // Set the type to "submit" for form submission
        sx={{
          height: "47px",
          textTransform: "none",
          boxShadow: "none",
          borderRadius: "9px",
          marginTop: "16px",
        }}
        onClick={() => {
          navigate("/create-account");
        }}
      >
        Je n'ai pas de compte
      </Button>
    </Box>
  );
}

export default Login;

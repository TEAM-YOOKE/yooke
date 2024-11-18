import React from "react";
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
import Link from "@mui/material/Link";

function CreateAccount() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  return (
    <Box sx={{ padding: "27px 20px" }}>
      <h1 className="h1">Créer un compte</h1>
      <p className="body1" style={{ marginTop: "2px" }}>
        Remplissez le formulaire pour continuer
      </p>
      {/* Login form or content */}
      <form action="" style={{ marginTop: "44px" }}>
        <TextField
          label="Nom d’utilisateur"
          id="phone"
          name="phone"
          type="text"
          fullWidth
          margin="normal"
          variant="outlined"
          color="secondary"
          required
        />
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
        <TextField
          label="E-mail ou Nom d'utilisateur"
          id="phone"
          name="phone"
          type="text"
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
          <InputLabel htmlFor="outlined-adornment-password" color="secondary">
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
        <FormControl
          variant="outlined"
          fullWidth
          required
          sx={{ marginTop: "14px" }}
        >
          <InputLabel htmlFor="outlined-adornment-password" color="secondary">
            Retapez le mot de passe
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
            label="Retapez le mot de passe"
          />
        </FormControl>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "44px",
            marginTop: "44px",
          }}
        >
          <p className="body1">
            J'accepte les{" "}
            <Link href="#">conditions générales d'utilisation</Link>
          </p>
          <Switch color="secondary" />
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
          S’inscrire
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
          navigate("/");
        }}
      >
        J'ai déjà un compte
      </Button>
    </Box>
  );
}

export default CreateAccount;

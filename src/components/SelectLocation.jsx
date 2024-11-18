import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import {
  Box,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { LanguageContext } from "../helpers/LanguageContext";

const stopPointsList = [
  "Carrefour Obili",
  "Carrefour Biyem-Assi",
  "Carrefour Essos",
  "Carrefour Mvan",
  "Carrefour Bastos",
  "Carrefour Tsinga",
  "Carrefour Elig-Essono",
  "Carrefour Nlongkak",
  "Carrefour Mokolo",
  "Carrefour Emana",
  "Carrefour Ekounou",
  "Carrefour Nsam",
  "Carrefour Tam-Tam",
  "Carrefour Titi-Garage",
  "Carrefour Tsinga",
  "Carrefour Ahala",
  "Carrefour Nkolmesseng",
  "Carrefour Messassi",
  "Carrefour MEEC",
  "Carrefour Olezoa",
  "Carrefour Warda",
  "Carrefour Kennedy",
  "Carrefour Yaoundé II",
  "Carrefour GP",
  "Total Biyem-Assi",
  "Total Emana",
  "Total Mvog-Betsi",
  "Total Melen",
  "Total Bastos",
  "Total Tsinga",
  "Marché Mokolo",
  "Marché Mfoundi",
  "Marché Madagascar",
  "Marché Central",
  "Marché Acacia",
  "Marché Essos",
  "Marché Biyem-Assi",
  "Marché Etoudi",
  "Quartier Bastos",
  "Quartier Elig-Essono",
  "Quartier Melen",
  "Quartier Mbankolo",
  "Quartier Obili",
  "Quartier Nlongkak",
  "Yoyo Bar",
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SelectLocation({
  label,
  selectedLocation,
  onSelect,
  customStyles,
}) {
  const { language } = React.useContext(LanguageContext);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (point) => {
    onSelect(point);
    handleClose();
  };

  const filteredStopPoints = stopPointsList.filter((point) =>
    point.toLowerCase().includes(search.toLowerCase())
  );

  const displayLabel = selectedLocation
    ? `${label} (${
        selectedLocation.length > 7
          ? selectedLocation.substring(0, 7) + "..."
          : selectedLocation
      })`
    : label;

  return (
    <React.Fragment>
      <Box
        onClick={handleClickOpen}
        sx={{
          borderBottom: "1px solid #C4C4C4",
          cursor: "pointer",
          ...customStyles,
        }}
      >
        <Box
          sx={{
            position: "relative",
            top: "-3px",
          }}
        >
          {displayLabel}
        </Box>
      </Box>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Box
          sx={{
            position: "fixed",
            background: "#fff",
            width: "100%",
            borderBottom: "8px solid #eee",
            paddingBottom: "16px",
            zIndex: "1",
          }}
        >
          <AppBar
            sx={{
              position: "relative",
              background: "#fff",
              color: "#000",
              boxShadow: "none",
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {label}
              </Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ padding: "16px 24px 0 24px" }}>
            <TextField
              id="outlined-search"
              placeholder={language.selectLocation.searchPlaceholder}
              type="search"
              variant="outlined"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
        <List>
          <div
            style={{
              height: "152px",
              display: "block",
              width: "10px",
              color: "red",
            }}
          ></div>
          {filteredStopPoints.map((point, index) => (
            <ListItem key={`${point}-${index}`} disablePadding>
              <ListItemButton
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontStyle: selectedLocation === point ? "italic" : "normal",
                  opacity: selectedLocation === point ? 0.6 : 1,
                }}
                onClick={() => handleSelect(point)}
              >
                <Box>{point}</Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </React.Fragment>
  );
}

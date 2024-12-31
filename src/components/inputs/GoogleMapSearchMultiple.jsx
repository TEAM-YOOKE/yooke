import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";
import { IconButton, InputBase, Paper, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

const GoogleMapSearchMultiple = ({ value, setValue }) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const loaded = React.useRef(false);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }
    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      debounce((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 400),
    []
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value || []);
      return undefined;
    }

    fetch(
      {
        input: inputValue,
        componentRestrictions: { country: "gh" },
      },
      (results) => {
        if (active) {
          let newOptions = [];

          if (value) {
            newOptions = [...value];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      multiple
      id="google-map-multi"
      fullWidth
      options={options}
      value={value || []}
      onChange={(event, newValue) => {
        const selectedValues = newValue.map((option) =>
          typeof option === "string"
            ? option
            : option.structured_formatting.main_text
        );
        setValue(selectedValues);
      }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={(x) => x}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Add stop points"
          fullWidth
          variant="outlined"
          margin="normal"
        />
      )}
      renderOption={(props, option) => {
        console.log("options", option);
        const matches =
          option.structured_formatting?.main_text_matched_substrings || [];
        const parts = option.structured_formatting
          ? parse(
              option.structured_formatting.main_text,
              matches.map((match) => [
                match.offset,
                match.offset + match.length,
              ])
            )
          : [{ text: option.description, highlight: false }];
        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: "flex", width: 44 }}>
                <LocationOnIcon />
              </Grid>
              <Grid item sx={{ width: "calc(100% - 44px)" }}>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? "bold" : "normal" }}
                  >
                    {part.text}
                  </span>
                ))}
                <Typography variant="body2" color="textSecondary">
                  {option.structured_formatting?.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

export default GoogleMapSearchMultiple;

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";
import { IconButton, InputBase, Paper } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const autocompleteService = { current: null };

const GoogleMapSearch = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  const setGeolocation = (address) => {
    let lat = "";
    let lng = "";
    var geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      {
        address,
      },
      function (results, status) {
        if (status === "OK") {
          lat = results[0].geometry.location.lat();
          lng = results[0].geometry.location.lng();
          console.log("longitude->", lng);
          console.log("latitude", lat);

          props.setPinLocation({ lat, lng });
        } else {
          console.log(
            "Geocode was not successful for the following reason: " + status
          );
        }
      }
    );
  };

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
      setOptions(props.value ? [props.value] : []);
      return undefined;
    }

    fetch(
      {
        input: inputValue,
        componentRestrictions: { country: "gh" },
        // types: ["transit_station"],
      },
      (results) => {
        if (active) {
          let newOptions = [];

          if (props.value) {
            newOptions = [props.value];
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
  }, [props.value, inputValue, fetch]);

  return (
    <Autocomplete
      id="google-map-demo"
      fullWidth
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={props.value}
      noOptionsText="No locations"
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        props.setValue(newValue);
        setGeolocation(newValue.description);
        console.log(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <div ref={params.InputProps.ref}>
          <Paper
            elevation={0}
            component="form"
            sx={{
              borderRadius: "20px",
              p: "4px 4px",
              display: "flex",
              alignItems: "center",
              border: "2px solid #22CEA6",
            }}
          >
            <InputBase
              size="large"
              {...params.inputProps}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Enter your pick up location"
              inputProps={{ "aria-label": "search google maps" }}
            />
            {inputValue && inputValue.length ? (
              <IconButton
                onClick={() => props.setValue(null)}
                color="error"
                aria-label="directions"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            ) : (
              ""
            )}
          </Paper>
        </div>
      )}
      renderOption={(props, option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings || [];

        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length])
        );

        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: "flex", width: 44 }}>
                <LocationOnIcon sx={{ color: "text.secondary" }} />
              </Grid>
              <Grid
                item
                sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
              >
                {parts.map((part, index) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
                  >
                    {part.text}
                  </Box>
                ))}

                <Typography variant="body2" color="text.secondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

export default GoogleMapSearch;

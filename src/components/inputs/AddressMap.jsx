import { Box } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";

const AddressMap = ({
  setAddressLoading,
  pinLocation,
  address,
  setPinLocation,
}) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const userMarkerRef = useRef(null);

  const getCurrentLocation = (map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User's current location:", { latitude, longitude });
          if (!pinLocation) {
            setPinLocation({ lat: latitude, lng: longitude });
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by the browser");
    }
  };

  useEffect(() => {
    const geocoder = new window.google.maps.Geocoder();
    console.log("Pin location ---->", pinLocation);

    // Get user's current location

    getCurrentLocation();

    const map = new window.google.maps.Map(mapRef.current, {
      center: {
        lat: pinLocation?.lat || 5.5697896,
        lng: pinLocation?.lng || -0.2737368,
      },
      zoom: 17,
      disableDefaultUI: true,
      clickableIcons: false,
    });

    // Draggable marker
    const marker = new window.google.maps.Marker({
      position: {
        lat: pinLocation?.lat || 5.5697896,
        lng: pinLocation?.lng || -0.2737368,
      },
      map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    markerRef.current = marker;

    // Event listener for when the marker is dropped
    marker.addListener("dragend", () => {
      setAddressLoading(true);
      const position = marker.getPosition();
      const lat = position.lat();
      const lng = position.lng();

      console.log("Marker dropped at:", { lat, lng });
      setPinLocation({ lat, lng });
      setAddressLoading(false);

      // Use Geocoding API to get the address of the marker's position
      //   geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      //     if (status === "OK" && results[0]) {
      //       console.log("Address:", results[0]);
      //       setAddress(results[0]); // Update the address state
      //       setAddressLoading(false); // Stop loading state
      //     } else {
      //       console.error("Geocoder failed:", status);
      //       setAddressLoading(false);
      //     }
      //   });
    });

    // Event listener for map drag to update marker position to the center of the map
    // map.addListener("dragend", () => {
    //   const center = map.getCenter();
    //   marker.setPosition(center); // Move the marker to the new map center
    // });
  }, [address, pinLocation]);

  return (
    <Box ref={mapRef} id="map" style={{ width: "100%", height: "100%" }} />
  );
};

export default AddressMap;

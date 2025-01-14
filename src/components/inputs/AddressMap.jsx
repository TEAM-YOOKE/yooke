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

  useEffect(() => {
    const geocoder = new window.google.maps.Geocoder();
    console.log("Pin location ---->", pinLocation);
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

    // Add marker for user's current location
    const userMarker = new window.google.maps.Marker({
      map,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      },
    });

    userMarkerRef.current = userMarker;

    // Function to update user's live location
    const updateUserLocation = (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      console.log("User's live location:", { lat, lng });

      // Update user marker position
      const latLng = new window.google.maps.LatLng(lat, lng);
      userMarker.setPosition(latLng);
      map.panTo(latLng); // Center the map on user's location

      // Update external state if needed
      // setUserLocation && setUserLocation({ lat, lng });
    };

    // Error handling for geolocation
    const handleLocationError = (error) => {
      console.error("Error getting user location:", error.message);
    };

    // Watch user's live location
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        updateUserLocation,
        handleLocationError,
        {
          enableHighAccuracy: true,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

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

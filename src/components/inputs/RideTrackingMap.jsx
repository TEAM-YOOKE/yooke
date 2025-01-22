import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import useCurrentUserDoc from "../../hooks/currentUserDoc";
const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4e4e4e" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4e4e4e" }],
  },
];
const RideTrackingMap = (props) => {
  const mapRef = useRef(null);

  const {
    currentUserDoc: currentUser,
    currentUserDocLoading,
    rideData,
    rideDataLoading,
  } = useCurrentUserDoc();

  console.log("current user", rideData);

  const loadMapDetails = (driverLoc, passengerLoc) => {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#784af4",
        strokeOpacity: 0.8,
        strokeWeight: 4,
      },
    });

    if (!mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: driverLoc,
      zoom: 17,
      gestureHandling: "greedy",
      disableDefaultUI: true,
      clickableIcons: false,
      styles: mapStyles,
    });

    // Driver Marker
    new window.google.maps.Marker({
      position: driverLoc,
      icon: {
        url: "/pin.png",
        scaledSize: new window.google.maps.Size(40, 40),
      },
      map,
    });

    // Passenger Marker
    new window.google.maps.Marker({
      position: passengerLoc,
      icon: {
        url: "/pin.png",
        scaledSize: new window.google.maps.Size(50, 50),
      },
      map,
    });

    directionsRenderer.setMap(map);

    directionsService
      .route({
        origin: driverLoc,
        destination: passengerLoc,
        travelMode: window.google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);

        if (response.routes[0]?.legs[0]) {
          const leg = response.routes[0].legs[0];
          props.setCalculatedDistance?.(leg.distance.text);
          props.setEstimatedTime?.(leg.duration.text);
        }
      })
      .catch((error) => {
        console.error("Directions request failed:", error);
      });
  };

  const setLocations = () => {
    const geocoder = new window.google.maps.Geocoder();
    const driverAddress = rideData?.stopPoints[0];
    const passengerAddress =
      currentUser?.pickUpLocation?.address?.description ||
      currentUser?.pickUpLocation;

    const geocodeAddress = (address) =>
      new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK" && results[0]) {
            const location = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            };
            resolve(location);
          } else {
            reject(`Geocode failed for ${address}: ${status}`);
          }
        });
      });

    Promise.all([
      geocodeAddress(driverAddress),
      geocodeAddress(passengerAddress),
    ])
      .then(([driverLoc, passengerLoc]) => {
        loadMapDetails(driverLoc, passengerLoc);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (window.google && window.google.maps) {
      setLocations();
    } else {
      console.error("Google Maps API not loaded.");
    }
  }, [rideData]);

  return (
    <Box ref={mapRef} id="map" style={{ width: "100%", height: "100%" }} />
  );
};

export default RideTrackingMap;

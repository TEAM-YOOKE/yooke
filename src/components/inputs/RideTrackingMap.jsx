import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";

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
      zoom: 15,
      gestureHandling: "greedy",
      disableDefaultUI: true,
      clickableIcons: false,
      styles: mapStyles,
    });

    // Driver Marker
    new window.google.maps.Marker({
      position: driverLoc,
      icon: {
        url: "/car-location.png",
        scaledSize: new window.google.maps.Size(40, 40),
      },
      map,
    });

    // Passenger Marker
    new window.google.maps.Marker({
      position: passengerLoc,
      icon: {
        url: "/pin2.png",
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
    if (!props.rideData?.driverLiveLocation) {
      console.error("Driver live location is missing.");
      return;
    }

    const driverLoc = {
      lat: props.rideData.driverLiveLocation.latitude,
      lng: props.rideData.driverLiveLocation.longitude,
    };

    let passengerLoc = props.currentUser?.pickUpLocation;

    // Check if pickUpLocation is already in lat/lng format
    if (
      passengerLoc &&
      typeof passengerLoc.lat === "number" &&
      typeof passengerLoc.lng === "number"
    ) {
      loadMapDetails(driverLoc, passengerLoc);
    } else {
      // If not, use geocoding
      const geocoder = new window.google.maps.Geocoder();
      const address =
        passengerLoc?.address?.description || passengerLoc?.address || "";

      if (!address) {
        console.error("Passenger location is missing.");
        return;
      }

      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          passengerLoc = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          loadMapDetails(driverLoc, passengerLoc);
        } else {
          console.error("Geocode failed for passenger location:", status);
        }
      });
    }
  };

  useEffect(() => {
    if (window.google && window.google.maps) {
      setLocations();
    } else {
      console.error("Google Maps API not loaded.");
    }
  }, []);

  return (
    <Box ref={mapRef} id="map" style={{ width: "100%", height: "100%" }} />
  );
};

export default RideTrackingMap;

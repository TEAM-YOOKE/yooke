import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

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

const RideTrackingMap2 = (props) => {
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null); // Store driver marker reference
  const [map, setMap] = useState(null);

  const loadMap = (center) => {
    if (!mapRef.current) return;

    const newMap = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 16,
      gestureHandling: "greedy",
      disableDefaultUI: true,
      clickableIcons: false,
      styles: mapStyles,
    });

    setMap(newMap);
    return newMap;
  };

  const addMarkers = (driverLoc, passengerLoc, map) => {
    if (!map) return;

    // Driver Marker (Store reference to update later)
    driverMarkerRef.current = new window.google.maps.Marker({
      position: driverLoc,
      icon: {
        url: "/car-location.png",
        scaledSize: new window.google.maps.Size(40, 40),
      },
      map,
    });

    // Passenger Marker (Static)
    new window.google.maps.Marker({
      position: passengerLoc,
      icon: {
        url: "/pin2.png",
      },
      map,
    });
  };

  const updateDriverLocation = (newDriverLoc) => {
    if (driverMarkerRef.current) {
      driverMarkerRef.current.setPosition(newDriverLoc);
    }
  };

  const loadDirections = (driverLoc, passengerLoc, map) => {
    if (!map) return;

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#784af4",
        strokeOpacity: 0.8,
        strokeWeight: 4,
      },
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

  useEffect(() => {
    if (!props.rideData?.driverLiveLocation) {
      console.error("Driver live location is missing.");
      return;
    }

    const driverLoc = {
      lat: props.rideData.driverLiveLocation.latitude,
      lng: props.rideData.driverLiveLocation.longitude,
    };

    let passengerLoc = props.currentUser?.pickUpLocation?.pinLocation;
    console.log("passengerLoc", passengerLoc);

    if (
      passengerLoc &&
      typeof passengerLoc.lat === "number" &&
      typeof passengerLoc.lng === "number"
    ) {
      if (!map) {
        const newMap = loadMap(driverLoc);
        setMap(newMap);

        addMarkers(driverLoc, passengerLoc, newMap);
        loadDirections(driverLoc, passengerLoc, newMap);
      }
    }
  }, [props.rideData]); // Reload only when rideData changes

  useEffect(() => {
    if (props.rideData?.driverLiveLocation) {
      const newDriverLoc = {
        lat: props.rideData.driverLiveLocation.latitude,
        lng: props.rideData.driverLiveLocation.longitude,
      };
      updateDriverLocation(newDriverLoc);
    }
  }, [props.rideData?.driverLiveLocation]); // Update driver marker when location changes

  return (
    <Box ref={mapRef} id="map" style={{ width: "100%", height: "100%" }} />
  );
};

export default RideTrackingMap2;

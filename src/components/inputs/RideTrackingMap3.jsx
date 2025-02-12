import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ref, onValue, set } from "firebase/database"; // Firebase Realtime Database
import { database } from "../../firebase-config";
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

const RideTrackingMap3 = ({
  rideData,
  currentUser,
  setCalculatedDistance,
  setEstimatedTime,
}) => {
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const directionsRendererRef = useRef(null);
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

    // Driver Marker
    driverMarkerRef.current = new window.google.maps.Marker({
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
      icon: { url: "/pin2.png" },
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
    directionsRendererRef.current = directionsRenderer;

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
          setCalculatedDistance?.(leg.distance.text);
          setEstimatedTime?.(leg.duration.text);
        }
      })
      .catch((error) => {
        console.error("Directions request failed:", error);
      });
  };

  useEffect(() => {
    if (!rideData?.driverLiveLocation) {
      console.error("Driver live location is missing.");
      return;
    }

    const driverLoc = {
      lat: rideData.driverLiveLocation.latitude,
      lng: rideData.driverLiveLocation.longitude,
    };

    const passengerLoc = currentUser?.pickUpLocation?.pinLocation;

    if (passengerLoc?.lat && passengerLoc?.lng) {
      if (!map) {
        const newMap = loadMap(driverLoc);
        setMap(newMap);

        addMarkers(driverLoc, passengerLoc, newMap);
        loadDirections(driverLoc, passengerLoc, newMap);
      }
    }
  }, [rideData]);

  useEffect(() => {
    if (!rideData?.driverId) return;

    const driverRef = ref(database, `driverLocations/${rideData.driverId}`);

    const unsubscribe = onValue(driverRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.latitude && data?.longitude) {
        const newDriverLoc = { lat: data.latitude, lng: data.longitude };

        updateDriverLocation(newDriverLoc);

        if (map && directionsRendererRef.current) {
          loadDirections(
            newDriverLoc,
            currentUser?.pickUpLocation?.pinLocation,
            map
          );
        }
      }
    });

    return () => unsubscribe();
  }, [rideData?.driverId, map]);

  return (
    <Box ref={mapRef} id="map" style={{ width: "100%", height: "100%" }} />
  );
};

export default RideTrackingMap3;

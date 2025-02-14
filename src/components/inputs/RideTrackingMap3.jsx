import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ref, onValue } from "firebase/database"; // Firebase Realtime Database
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
  const passengerMarkerRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const [map, setMap] = useState(null);

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current || map) return;

    const newMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: 0, lng: 0 }, // Default center (updates when driver location is available)
      zoom: 16,
      gestureHandling: "greedy",
      disableDefaultUI: true,
      clickableIcons: false,
      styles: mapStyles,
    });

    setMap(newMap);
  }, []);

  // Function to add markers
  const addMarkers = (driverLoc, passengerLoc) => {
    if (!map) return;

    // Driver Marker
    if (!driverMarkerRef.current) {
      driverMarkerRef.current = new window.google.maps.Marker({
        position: driverLoc,
        icon: {
          url: "/car-location.png",
          scaledSize: new window.google.maps.Size(40, 40),
        },
        map,
      });
    } else {
      driverMarkerRef.current.setPosition(driverLoc);
    }

    // Passenger Marker (Only created once)
    if (!passengerMarkerRef.current) {
      passengerMarkerRef.current = new window.google.maps.Marker({
        position: passengerLoc,
        icon: {
          url: "/pin2.png",
          // scaledSize: new window.google.maps.Size(40, 40),
        },
        map,
      });
    }
  };

  // Function to update driver location
  const updateDriverLocation = (newDriverLoc) => {
    if (driverMarkerRef.current) {
      driverMarkerRef.current.setPosition(newDriverLoc);
    }
  };

  // Function to load/update directions
  const loadDirections = (driverLoc, passengerLoc) => {
    if (!map) return;

    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null); // Clear previous route
    }

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

  // Listen for driver location updates
  useEffect(() => {
    if (!rideData?.driverId || !map) return;

    const driverRef = ref(database, `driverLocations/${rideData.driverId}`);

    const unsubscribe = onValue(driverRef, (snapshot) => {
      const data = snapshot.val();

      const driverLoc = {
        lat: data?.latitude || rideData.driverLiveLocation?.latitude || 0,
        lng: data?.longitude || rideData.driverLiveLocation?.longitude || 0,
      };

      const passengerLoc = currentUser?.pickUpLocation?.pinLocation;

      if (passengerLoc?.lat && passengerLoc?.lng) {
        if (!driverMarkerRef.current || !passengerMarkerRef.current) {
          addMarkers(driverLoc, passengerLoc);
        } else {
          updateDriverLocation(driverLoc);
        }
        loadDirections(driverLoc, passengerLoc);
      }
    });

    return () => unsubscribe();
  }, [rideData?.driverId, map]);

  return (
    <Box ref={mapRef} id="map" style={{ width: "100%", height: "100%" }} />
  );
};

export default RideTrackingMap3;

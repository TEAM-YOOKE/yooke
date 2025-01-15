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
  navigator.geolocation.watchPosition(updateUserLocation, handleLocationError, {
    enableHighAccuracy: true,
    maximumAge: 0,
  });
} else {
  console.error("Geolocation is not supported by this browser.");
}

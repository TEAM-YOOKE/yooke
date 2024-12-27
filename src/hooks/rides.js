import useSWR from "swr";
import { fetchFirestoreCollection } from "../services/firestoreConfig";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase-config";

const useRides = () => {
  const {
    data: rides,
    error,
    isLoading,
    mutate,
  } = useSWR(
    "rides", // the key for caching
    () => fetchFirestoreCollection("rides") // fetch data from Firestore
  );
  const [ridesWithOwners, setRidesWithOwners] = useState([]);

  useEffect(() => {
    if (rides) {
      const fetchCarOwners = async () => {
        try {
          const promises = rides.map(async (ride) => {
            const carOwnerDocRef = doc(db, "accounts", ride.driverId); // Use driverDocId
            const carOwnerDoc = await getDoc(carOwnerDocRef);
            if (carOwnerDoc.exists()) {
              const carOwnerData = carOwnerDoc.data();
              return { ...ride, driver: carOwnerData };
            }
            return null; // Return ride unchanged if car owner doesn't exist
          });

          const updatedRides = (await Promise.all(promises)).filter(Boolean);
          setRidesWithOwners(updatedRides);
        } catch (error) {
          console.error("Error fetching car owners:", error);
        }
      };

      fetchCarOwners();
    }
  }, [rides]);

  return {
    rides: ridesWithOwners,
    ridesLoading: isLoading,
    refreshRides: mutate,
    ridesError: error,
  };
};

export default useRides;

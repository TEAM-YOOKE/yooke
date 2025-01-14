import useSWR from "swr";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import useCurrentUserDoc from "./currentUserDoc";

const fetchRidesByLocation = async (pickUpLocation) => {
  const ridesRef = collection(db, "rides");
  const q = query(
    ridesRef,
    where("stopPoints", "array-contains", pickUpLocation)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const useUserLocationRides = () => {
  const { currentUserDoc } = useCurrentUserDoc();
  const [ridesWithOwners, setRidesWithOwners] = useState([]);

  const {
    data: rides,
    error,
    isLoading,
    mutate,
  } = useSWR(
    currentUserDoc?.pickUpLocation
      ? `rides-${currentUserDoc.pickUpLocation}` // Cache key includes location
      : null, // Do not fetch until pickUpLocation is available
    () =>
      fetchRidesByLocation(
        currentUserDoc.pickUpLocation?.address?.structured_formatting
          ?.main_text || currentUserDoc.pickUpLocation
      )
  );

  useEffect(() => {
    if (rides) {
      const fetchRideOwners = async () => {
        try {
          const ridePromises = rides.map(async (ride) => {
            const driverDocRef = doc(db, "accounts", ride.driverId);
            const driverDoc = await getDoc(driverDocRef);

            if (driverDoc.exists()) {
              return { ...ride, driver: driverDoc.data() };
            }
            console.warn(`Driver with ID ${ride.driverId} not found.`);
            return { ...ride, driver: null };
          });

          const updatedRides = (await Promise.all(ridePromises)).filter(
            Boolean
          );
          setRidesWithOwners(updatedRides);
        } catch (error) {
          console.error("Error fetching ride owners:", error);
        }
      };

      fetchRideOwners();
    }
  }, [rides]);

  return {
    rides: ridesWithOwners,
    ridesLoading: isLoading,
    refreshRides: mutate,
    ridesError: error,
  };
};

export default useUserLocationRides;

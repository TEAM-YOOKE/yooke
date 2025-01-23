import useSWR from "swr";
import { fetchFirestoreCollection } from "../services/firestoreConfig";
import { useAuth } from "../helpers/GeneralContext";
import {
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { useEffect, useState } from "react";

const useCurrentUserDoc = () => {
  const { currentUser } = useAuth();
  const [currentUserDoc, setCurrentUserDoc] = useState(null);
  const [rideData, setRideData] = useState(null);
  const [rideDataLoading, setRideDataLoading] = useState(false);

  // Fetch user document
  const fetchCurrentUserDoc = async () => {
    if (!currentUser) return null;

    const accounts = await fetchFirestoreCollection("accounts");
    const userDoc = accounts.find(
      (account) => account.email === currentUser.email
    );
    setCurrentUserDoc(userDoc);
    return userDoc;
  };

  // Fetch ride data
  const fetchRideData = async (userDoc) => {
    if (!userDoc || !userDoc.assignedCar) {
      setRideData(null);
      return null;
    }

    try {
      setRideDataLoading(true);
      const rideDocRef = doc(db, "rides", userDoc.assignedCar);
      const rideSnapshot = await getDoc(rideDocRef);
      const ride = rideSnapshot.data();

      console.log("ride", ride);
      if (ride && ride.passengers.includes(userDoc.id)) {
        const driverDocRef = doc(db, "accounts", ride.driverId);
        const driverSnapshot = await getDoc(driverDocRef);

        const carData = driverSnapshot.exists()
          ? {
              name: driverSnapshot.data().carName,
              plate: driverSnapshot.data().carPlate,
            }
          : null;

        const driverData = driverSnapshot.exists()
          ? { ...driverSnapshot.data() }
          : null;

        // Fetch passenger details
        const passengerIds = ride.passengers || [];
        const passengerPromises = passengerIds.map(async (id) => {
          const passengerDocRef = doc(db, "accounts", id);

          const passengerSnapshot = await getDoc(passengerDocRef);
          if (passengerSnapshot.exists()) {
            return passengerSnapshot.data();
          } else return null;
        });
        const passengerList = await Promise.all(passengerPromises);
        const rideDetails = {
          ...ride,
          car: carData,
          driverData,
          passengers: passengerList,
        };
        setRideData(rideDetails);
        return rideDetails;
      }
    } catch (error) {
      console.error("Error fetching ride data:", error);
      return null;
    } finally {
      setRideDataLoading(false);
    }
  };

  // SWR for user document
  const {
    data: userDoc,
    error: userError,
    isLoading: userLoading,
    mutate: refreshUserDoc,
  } = useSWR(currentUser ? "currentUserDoc" : null, fetchCurrentUserDoc);

  // Fetch ride data whenever userDoc changes
  useEffect(() => {
    if (userDoc) {
      console.log("userDoc", userDoc);
      fetchRideData(userDoc);
    }
  }, [userDoc]);

  return {
    currentUserDoc: userDoc,
    currentUserDocLoading: userLoading,
    refreshCurrentUserDoc: refreshUserDoc,
    currentUserDocError: userError,
    rideData,
    rideDataLoading,
    refreshRideData: () => fetchRideData(userDoc),
  };
};

export default useCurrentUserDoc;

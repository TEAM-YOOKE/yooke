import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import { useAuth } from "../helpers/GeneralContext";
import useSWR from "swr";
import { fetchFirestoreCollection } from "../services/firestoreConfig";

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

  // Fetch additional ride details
  const fetchRideDetails = async (ride) => {
    try {
      // Fetch driver details
      const driverDocRef = doc(db, "accounts", ride.driverId);
      const driverSnapshot = await getDoc(driverDocRef);
      const driverData = driverSnapshot.exists() ? driverSnapshot.data() : null;

      // Fetch car details
      const carData = driverSnapshot.exists()
        ? {
            name: driverSnapshot.data().carName,
            plate: driverSnapshot.data().carPlate,
          }
        : null;

      // Fetch passenger details
      const passengerIds = ride.passengers || [];
      const passengerPromises = passengerIds.map(async (id) => {
        const passengerDocRef = doc(db, "accounts", id);
        const passengerSnapshot = await getDoc(passengerDocRef);
        return passengerSnapshot.exists() ? passengerSnapshot.data() : null;
      });

      const passengerList = await Promise.all(passengerPromises);

      return { ...ride, car: carData, driverData, passengers: passengerList };
    } catch (error) {
      console.error("Error fetching ride details:", error);
      return { ...ride, car: null, driverData: null, passengers: [] };
    }
  };

  // Listen for real-time updates to ride data
  const setupRideListener = (userDoc) => {
    if (!userDoc || !userDoc.assignedCar) return;
    setRideDataLoading(true);

    const rideDocRef = doc(db, "rides", userDoc.assignedCar);

    // Set up real-time listener
    const unsubscribe = onSnapshot(rideDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        const ride = { id: snapshot.id, ...snapshot.data() };

        if (ride.passengers.includes(userDoc.id)) {
          const rideDetails = await fetchRideDetails(ride);
          setRideData(rideDetails);
        } else {
          setRideData(null);
        }
      } else {
        setRideData(null);
      }
      setRideDataLoading(false);
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
  };

  // SWR for user document
  const {
    data: userDoc,
    error: userError,
    isLoading: userLoading,
    mutate: refreshUserDoc,
  } = useSWR(currentUser ? "currentUserDoc" : null, fetchCurrentUserDoc);

  useEffect(() => {
    if (userDoc) {
      console.log("userDoc", userDoc);
      const unsubscribe = setupRideListener(userDoc);
      return () => {
        if (unsubscribe) unsubscribe(); // Cleanup listener when component unmounts
      };
    }
  }, [userDoc]);

  return {
    currentUserDoc: userDoc,
    currentUserDocLoading: userLoading,
    refreshCurrentUserDoc: refreshUserDoc,
    currentUserDocError: userError,
    rideData,
    rideDataLoading,
    refreshRideData: () => setupRideListener(userDoc),
  };
};

export default useCurrentUserDoc;

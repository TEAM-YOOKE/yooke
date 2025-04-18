import useSWR from "swr";
import { fetchFirestoreCollection } from "../services/firestoreConfig";
import { useAuth } from "../helpers/GeneralContext";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { useEffect, useState } from "react";

const useCurrentCarOwnerDoc = () => {
  const { currentUser } = useAuth();
  const [currentUserDoc, setCurrentUserDoc] = useState(null);
  const [rideData, setRideData] = useState(null);
  const [rideDataLoading, setRideDataLoading] = useState(false);
  const [unsubscribeRide, setUnsubscribeRide] = useState(null);

  // Fetch current user document
  const fetchCurrentCarOwnerDoc = async () => {
    if (!currentUser) return null;

    try {
      const accounts = await fetchFirestoreCollection("accounts");
      const userDoc = accounts.find(
        (account) => account.email === currentUser.email
      );

      setCurrentUserDoc(userDoc);
      return userDoc;
    } catch (error) {
      console.error("Error fetching current user document:", error);
      return null;
    }
  };

  // Fetch additional ride details
  const fetchRideDetails = async (ride) => {
    try {
      // Fetch passenger details
      const passengerIds = ride.passengers || [];
      const passengerPromises = passengerIds.map(async (id) => {
        const passengerDocRef = doc(db, "accounts", id);
        const passengerSnapshot = await getDoc(passengerDocRef);
        return passengerSnapshot.exists() ? passengerSnapshot.data() : null;
      });

      const passengerList = await Promise.all(passengerPromises);

      return { ...ride, passengers: passengerList };
    } catch (error) {
      console.error("Error fetching ride details:", error);
      return { ...ride, passengers: [] };
    }
  };

  // Set up real-time listener for ride data
  const setupRideListener = (userDoc) => {
    if (!userDoc) return;

    const rideCollection = collection(db, "rides");
    const q = query(rideCollection, where("driverId", "==", userDoc.id));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const rides = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (rides.length > 0) {
        const [firstRide] = rides;
        const rideDetails = await fetchRideDetails(firstRide);
        setRideData(rideDetails);
      } else {
        setRideData(null);
      }
    });

    setUnsubscribeRide(() => unsubscribe);
  };

  // SWR for user document
  const {
    data: userDoc,
    error: userError,
    isLoading: userLoading,
    mutate: refreshUserDoc,
  } = useSWR(currentUser ? "currentUserDoc" : null, fetchCurrentCarOwnerDoc);

  // Listen for real-time ride updates when userDoc changes
  useEffect(() => {
    if (userDoc) {
      console.log("Fetched userDoc:", userDoc);
      setupRideListener(userDoc);
    }

    return () => {
      if (unsubscribeRide) unsubscribeRide();
    };
  }, [userDoc]);

  return {
    currentCarOwnerDoc: userDoc,
    currentCarOwnerDocLoading: userLoading,
    refreshCurrentCarOwnerDoc: refreshUserDoc,
    currentCarOwnerDocError: userError,
    rideData,
    rideDataLoading,
    refreshRideData: () => setupRideListener(userDoc),
  };
};

export default useCurrentCarOwnerDoc;

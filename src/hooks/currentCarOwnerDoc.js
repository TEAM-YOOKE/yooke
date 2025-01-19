import useSWR from "swr";
import { fetchFirestoreCollection } from "../services/firestoreConfig";
import { useAuth } from "../helpers/GeneralContext";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useEffect, useState } from "react";

const useCurrentCarOwnerDoc = () => {
  const { currentUser } = useAuth();
  const [currentUserDoc, setCurrentUserDoc] = useState(null);
  const [rideData, setRideData] = useState(null);
  const [rideDataLoading, setRideDataLoading] = useState(false);

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

  // Fetch ride data where current user is the driver
  const fetchRideData = async (userDoc) => {
    try {
      setRideDataLoading(true);
      const rideCollection = collection(db, "rides");
      const q = query(rideCollection, where("driverId", "==", userDoc.id));
      const querySnapshot = await getDocs(q);
      const rides = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (rides.length > 0) {
        const [firstRide] = rides;
        setRideData(firstRide);
        console.log("Ride data -->", firstRide);
        return firstRide;
      } else {
        console.warn("No rides found for the current user as a driver.");
        return null;
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
  } = useSWR(currentUser ? "currentUserDoc" : null, fetchCurrentCarOwnerDoc);

  // Fetch ride data whenever userDoc changes
  useEffect(() => {
    if (userDoc) {
      console.log("Fetched userDoc:", userDoc);
      fetchRideData(userDoc);
    }
  }, [userDoc]);

  return {
    currentCarOwnerDoc: userDoc,
    currentCarOwnerDocLoading: userLoading,
    refreshCurrentCarOwnerDoc: refreshUserDoc,
    currentCarOwnerDocError: userError,
    rideData,
    rideDataLoading,
    refreshRideData: () => fetchRideData(userDoc),
  };
};

export default useCurrentCarOwnerDoc;

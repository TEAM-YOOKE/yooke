import useSWR from "swr";
import { fetchFirestoreCollection } from "../services/firestoreConfig";
import { useAuth } from "../helpers/GeneralContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useState } from "react";

const useCurrentUserDoc = () => {
  const { currentUser } = useAuth();
  const [myCurrentUserDoc, setMyCurrentUserDoc] = useState(null);

  const fetchCurrentUserDoc = async () => {
    if (!currentUser) return null; // Ensure a user is authenticated

    const accounts = await fetchFirestoreCollection("accounts"); // Fetch all accounts
    setMyCurrentUserDoc(
      accounts.find((account) => account.email === currentUser.email)
    );
    return accounts.find((account) => account.email === currentUser.email); // Find the current user's document
  };

  const fetchRideData = async () => {
    if (!myCurrentUserDoc || !myCurrentUserDoc.assignedCar) return null;

    try {
      const rideDocRef = doc(db, "rides", myCurrentUserDoc.assignedCar);
      const rideSnapshot = await getDoc(rideDocRef);
      const rideData = rideSnapshot.data();

      if (rideData) {
        const driverDocRef = doc(db, "accounts", rideData.driverId);
        const driverSnapshot = await getDoc(driverDocRef);

        if (driverSnapshot.exists()) {
          const driverData = driverSnapshot.data();
          return {
            ride: rideData,
            car: { name: driverData.carName, plate: driverData.carPlate },
          };
        } else {
          return { ride: rideData, car: null };
        }
      }
    } catch (error) {
      console.error("Error fetching ride data:", error);
      return null;
    }
  };

  const {
    data: userDoc,
    error: userError,
    isLoading: userLoading,
    mutate: refreshUserDoc,
  } = useSWR(currentUser ? "currentUserDoc" : null, fetchCurrentUserDoc);

  const {
    data: rideData,
    error: rideError,
    isLoading: rideLoading,
    mutate: refreshRideData,
  } = useSWR(
    myCurrentUserDoc && myCurrentUserDoc.assignedCar ? "rideData" : null,
    fetchRideData
  );

  return {
    currentUserDoc: userDoc,
    currentUserDocLoading: userLoading,
    refreshCurrentUserDoc: refreshUserDoc,
    currentUserDocError: userError,
    rideData,
    rideDataLoading: rideLoading,
    refreshRideData,
    rideDataError: rideError,
  };
};

export default useCurrentUserDoc;

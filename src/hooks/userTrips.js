import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import useCurrentUserDoc from "./currentUserDoc";

const useUserTrips = () => {
  const { currentUserDoc } = useCurrentUserDoc();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up real-time listener for trips
  useEffect(() => {
    if (!currentUserDoc?.id) {
      setTrips([]);
      setIsLoading(false);
      return () => {};
    }

    setIsLoading(true);
    const tripsRef = collection(db, "trips");
    const q = query(tripsRef, where("passengerId", "==", currentUserDoc.id));

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const tripsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort trips by startedAt timestamp (most recent first)
        const sortedTrips = tripsData.sort((a, b) => {
          // Handle null/undefined timestamps
          if (!a.startedAt && !b.startedAt) return 0;
          if (!a.startedAt) return 1;
          if (!b.startedAt) return -1;

          // Convert Firestore timestamps to milliseconds for comparison
          const timeA = a.startedAt.seconds ? a.startedAt.seconds * 1000 : 0;
          const timeB = b.startedAt.seconds ? b.startedAt.seconds * 1000 : 0;

          // Descending order (newest first)
          return timeB - timeA;
        });

        setTrips(sortedTrips);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching trips:", err);
        setError(err);
        setIsLoading(false);
      }
    );

    // Cleanup function to unsubscribe from listener when component unmounts
    return () => unsubscribe();
  }, [currentUserDoc?.id]);

  const refreshTrips = () => {
    // This is now a no-op since we're using real-time updates
    // But we keep the function for compatibility with existing code
    console.log("Manual refresh not needed - using real-time updates");
  };

  const cancelTrip = async (tripId) => {
    if (!tripId) return false;

    try {
      const tripRef = doc(db, "trips", tripId);
      const tripDoc = await getDoc(tripRef);

      if (!tripDoc.exists()) {
        throw new Error("Trip not found");
      }

      // Update the trip document
      await updateDoc(tripRef, {
        status: "cancelled",
        endedAt: serverTimestamp(),
      });

      // Update the ride document if needed
      const tripData = tripDoc.data();
      if (tripData?.rideId) {
        const rideRef = doc(db, "rides", tripData.rideId);
        const rideDoc = await getDoc(rideRef);

        if (rideDoc.exists()) {
          await updateDoc(rideRef, {
            rideStarted: false,
          });
        }
      }

      // No need to manually refresh since we have real-time updates
      return true;
    } catch (error) {
      console.error("Error cancelling trip:", error);
      return false;
    }
  };

  return {
    trips,
    tripsLoading: isLoading,
    refreshTrips,
    tripsError: error,
    cancelTrip,
  };
};

export default useUserTrips;

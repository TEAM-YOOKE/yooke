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

const fetchTripsByUserId = async (userId) => {
  const tripsRef = collection(db, "trips");
  const q = query(tripsRef, where("passengerId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const useUserTrips = () => {
  const { currentUserDoc } = useCurrentUserDoc();
  const [ridesWithOwners, setRidesWithOwners] = useState([]);

  const {
    data: trips,
    error,
    isLoading,
    mutate,
  } = useSWR(currentUserDoc?.id ? `trips-${currentUserDoc.id}` : null, () =>
    fetchTripsByUserId(currentUserDoc.id)
  );

  return {
    trips,
    tripsLoading: isLoading,
    refreshTrips: mutate,
    tripsError: error,
  };
};

export default useUserTrips;

import useSWR from "swr";
import { fetchFirestoreCollection } from "../services/firestoreConfig";

const useRides = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "rides", // the key for caching
    () => fetchFirestoreCollection("rides") // fetch data from Firestore
  );

  return {
    rides: data,
    ridesLoading: isLoading,
    refreshRides: mutate,
    ridesError: error,
  };
};

export default useRides;

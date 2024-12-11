import useSWR from "swr";
import { fetchFirestoreCollection } from "../services/firestoreConfig";

const useCars = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "cars", // the key for caching
    () => fetchFirestoreCollection("cars") // fetch data from Firestore
  );

  return {
    cars: data,
    carsLoading: isLoading,
    refreshCars: mutate,
    carsError: error,
  };
};

export default useCars;

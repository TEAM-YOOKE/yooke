import useSWR from "swr";
import { fetchFirestoreCollection } from "../services/firestoreConfig";

const usePassengers = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "passengers", // the key for caching
    async () => {
      const accounts = await fetchFirestoreCollection("accounts");
      console.log("accounts", accounts);
      return accounts.filter((account) => account.accountType === "Passenger");
    }
  );

  return {
    passengers: data,
    passengersLoading: isLoading,
    refreshPassengers: mutate,
    passengersError: error,
  };
};

export default usePassengers;

import useSWR from "swr";
import { fetchFirestoreCollection } from "../services/firestoreConfig";

const useAccounts = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "accounts", // the key for caching
    () => fetchFirestoreCollection("accounts") // fetch data from Firestore
  );

  return {
    accounts: data,
    accountsLoading: isLoading,
    refreshAccounts: mutate,
    accountsError: error,
  };
};

export default useAccounts;

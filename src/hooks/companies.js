import useSWR from "swr";
import { fetchFirestoreCollection } from "../services/firestoreConfig";

const useCompanies = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "companies", // the key for caching
    () => fetchFirestoreCollection("companies") // fetch data from Firestore
  );

  return {
    companies: data,
    companiesLoading: isLoading,
    refreshCompanies: mutate,
    companiesError: error,
  };
};

export default useCompanies;

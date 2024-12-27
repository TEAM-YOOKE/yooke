import useSWR from "swr";
import { fetchFirestoreCollection } from "../services/firestoreConfig";
import { useAuth } from "../helpers/GeneralContext";

const useCurrentUserDoc = () => {
  const { currentUser } = useAuth();

  const fetchCurrentUserDoc = async () => {
    if (!currentUser) return null; // Ensure a user is authenticated

    const accounts = await fetchFirestoreCollection("accounts"); // Fetch all accounts
    return accounts.find((account) => account.email === currentUser.email); // Find the current user's document
  };

  const { data, error, isLoading, mutate } = useSWR(
    currentUser ? "currentUserDoc" : null, // Use SWR only if there's a current user
    fetchCurrentUserDoc // Fetch the current user's document
  );

  return {
    currentUserDoc: data,
    currentUserDocLoading: isLoading,
    refreshCurrentUserDoc: mutate,
    currentUserDocError: error,
  };
};

export default useCurrentUserDoc;

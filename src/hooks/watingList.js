import useSWR from "swr";
import { fetchFirestoreCollection } from "../services/firestoreConfig";

const useWaitingList = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "waitinglist", // the key for caching
    () => fetchFirestoreCollection("waitinglist") // fetch data from Firestore
  );

  return {
    waitingList: data,
    waitingListLoading: isLoading,
    refreshWatingList: mutate,
    waitingListError: error,
  };
};

export default useWaitingList;

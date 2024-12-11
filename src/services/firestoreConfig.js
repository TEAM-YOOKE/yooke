import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

export const fetchFirestoreCollection = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

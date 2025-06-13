import { doc, getDoc } from "firebase/firestore";
import { db } from "./Firebase";

export async function fetchUserInfo(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? { id: userId, ...userSnap.data() } : null;
}

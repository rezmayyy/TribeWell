import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "./Firebase";

export async function fetchUserPosts(userId, postLimit = 3) {
  const q = query(
    collection(db, "content-posts"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc"),
    limit(postLimit)
  );
  const querySnap = await getDocs(q);
  return querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

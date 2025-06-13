import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "./Firebase";

export async function fetchUserPosts(userId, postLimit = 10) {   // Adjust to show number of posts on prof page
  const q = query(
    collection(db, "content-posts"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc"),
    limit(postLimit)
  );
  const querySnap = await getDocs(q);
  return querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

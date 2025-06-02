import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "./Firebase"; // your Firebase config

export const fetchFeedPosts = async (followingIds, limitCount) => {
  if (followingIds.length === 0) return [];

  // Firestore only allows 30 items in `in` queries
  const chunks = [];
  for (let i = 0; i < followingIds.length; i += 10) {
    const chunk = followingIds.slice(i, i + 10);
    const q = query(
      collection(db, "content-posts"),
      where("userId", "in", chunk),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    chunks.push(...snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }

  // Optionally sort client-side to merge chunks
  return chunks.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
};

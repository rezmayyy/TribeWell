/**
 * fetchFeedPosts Utility
 * -----------------------
 * Fetches posts from users the current user follows, from the "content-posts" Firestore collection.
 * Handles Firestore's `in` clause limit (max 10 elements) by querying in chunks.
 * 
 * Results are ordered by timestamp (most recent first) and merged into a single sorted list.
 * 
 * Used in the HomePage to populate the user's feed with relevant posts.
 */

import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

// Fetch recent posts from followed users, sorted globally and limited after combining
export const fetchFeedPosts = async (followingIds, limitCount) => {
  if (!followingIds.length) return [];

  let allPosts = [];

  for (let i = 0; i < followingIds.length; i += 10) {
    const chunk = followingIds.slice(i, i + 10);

    const q = query(
      collection(db, "content-posts"),
      where("userId", "in", chunk),
      orderBy("timestamp", "desc")
      // 👈 No limit here
    );

    const snap = await getDocs(q);
    const posts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    allPosts.push(...posts);
  }

  // Sort all posts by timestamp and apply the final limit
  return allPosts
    .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
    .slice(0, limitCount);
};

import { db } from './Firebase';
import { getDocs, collection, doc, getDoc } from 'firebase/firestore';

export async function fetchFollowedUsers(userId, limit = 5, startAtIndex = 0) {
  const subsSnap = await getDocs(collection(db, `users/${userId}/subscriptions`));
  const followedIds = subsSnap.docs.map(doc => doc.id);
  const slicedIds = followedIds.slice(startAtIndex, startAtIndex + limit); // Pagination

  const followedUsers = [];

  for (const uid of slicedIds) {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      followedUsers.push({ id: uid, ...userDoc.data() });
    }
  }

  return followedUsers;
}


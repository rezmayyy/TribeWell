/*
  Check in resets at midnight so yes if a user checks in at 11:59pm they can check in
  again at 12:01am which is only 2 minutes later. 
*/

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./Firebase";

function getTodayString() {
  return new Date().toDateString();
}

export async function handleDailyCheckIn(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  const todayStr = getTodayString();
  let streak = 1;

  if (userSnap.exists()) {
    const data = userSnap.data();
    const lastCheckInStr = data.lastCheckInStr || null;

    if (lastCheckInStr === todayStr) {
      return { message: "Already checked in today!", streak: data.streak };
    }

    const prevDate = new Date(data.lastCheckInStr);
    const diff = Math.floor((new Date() - prevDate) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak = (data.streak || 0) + 1;
    }
  }

  await setDoc(userRef, {
    lastCheckIn: serverTimestamp(),
    lastCheckInStr: todayStr,
    streak
  }, { merge: true });

  return { message: "Check-in successful!", streak };
}

export async function getCheckInStatus(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    const lastCheckInStr = data.lastCheckInStr || "";
    const hasCheckedIn = lastCheckInStr === getTodayString();
    return {
      hasCheckedIn,
      streak: data.streak || 0
    };
  }

  return { hasCheckedIn: false, streak: 0 };
}

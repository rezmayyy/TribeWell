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
  let currentPoints = 0;

  if (userSnap.exists()) {
    const data = userSnap.data();
    const lastCheckInStr = data.lastCheckInStr || null;
    currentPoints = data.points || 0;

    if (lastCheckInStr === todayStr) {
      return {
        message: "Already checked in today!",
        streak: data.streak || 0,
        points: currentPoints
      };
    }

    const prevDate = new Date(data.lastCheckInStr);
    const diff = Math.floor((new Date() - prevDate) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak = (data.streak || 0) + 1;
    }
  }

  // Award 100 StreakPoints
  const newPoints = currentPoints + 100;

  await setDoc(userRef, {
    lastCheckIn: serverTimestamp(),
    lastCheckInStr: todayStr,
    streak,
    points: newPoints
  }, { merge: true });

  return {
    message: "Check-in successful! 🎉 You earned 100 StreakPoints.",
    streak,
    points: newPoints
  };
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
      streak: data.streak || 0,
      points: data.points || 0
    };
  }

  return { hasCheckedIn: false, streak: 0, points: 0 };
}

import React, { useContext, useEffect, useState } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';
import { handleDailyCheckIn, getCheckInStatus } from '../services/checkInService';
import UserContext from '../contexts/UserContext';

export default function DailyCheckIn() {
  const { user } = useContext(UserContext);
  const [status, setStatus] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0); // new state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) return;
      const res = await getCheckInStatus(user.uid);
      setHasCheckedIn(res.hasCheckedIn);
      setStreak(res.streak);
      setPoints(res.points); // set points from status
      setLoading(false);
    };
    checkStatus();
  }, [user]);

  const onCheckIn = async () => {
    if (!user) return;
    const res = await handleDailyCheckIn(user.uid);
    setHasCheckedIn(true);
    setStreak(res.streak);
    setPoints(res.points); // update points after check-in
    setStatus(`${res.message} 🔥 Streak: ${res.streak} | 🏆 Points: ${res.points}`);
  };

  if (loading) return <Spinner animation="border" size="sm" />;

  return (
    <div>
      <Alert variant="secondary">🏆 Total StreakPoints: {points}</Alert>

      {hasCheckedIn ? (
        <Alert variant="success">
          ✅ You've already checked in today! 🔥 Streak: {streak}
        </Alert>
      ) : (
        <>
          <Button variant="success" onClick={onCheckIn}>Check In</Button>
          {status && <Alert variant="info" className="mt-2">{status}</Alert>}
        </>
      )}
    </div>
  );
}

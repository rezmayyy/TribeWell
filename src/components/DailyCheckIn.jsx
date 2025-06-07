import React, { useContext, useEffect, useState } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';
import { handleDailyCheckIn, getCheckInStatus } from '../services/checkInService';
import UserContext from '../contexts/UserContext';

export default function DailyCheckIn() {
  const { user } = useContext(UserContext);
  const [status, setStatus] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) return;
      const res = await getCheckInStatus(user.uid);
      setHasCheckedIn(res.hasCheckedIn);
      setStreak(res.streak);
      setLoading(false);
    };
    checkStatus();
  }, [user]);

  const onCheckIn = async () => {
    if (!user) return;
    const res = await handleDailyCheckIn(user.uid);
    setHasCheckedIn(true);
    setStreak(res.streak);
    setStatus(res.message + " 🔥 Streak: " + res.streak);
  };

  if (loading) return <Spinner animation="border" size="sm" />;

  return (
    <div>
      {hasCheckedIn ? (
        <Alert variant="success">✅ You've already checked in today! 🔥 Streak: {streak}</Alert>
      ) : (
        <>
          <Button variant="success" onClick={onCheckIn}>Check In</Button>
          {status && <Alert variant="info" className="mt-2">{status}</Alert>}
        </>
      )}
    </div>
  );
}

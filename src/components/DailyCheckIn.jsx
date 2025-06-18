import React, { useContext, useEffect, useState } from 'react';
import { Button, Alert, Spinner, Card, Badge } from 'react-bootstrap';
import { handleDailyCheckIn, getCheckInStatus } from '../services/checkInService';
import UserContext from '../contexts/UserContext';
import { FaFire, FaCalendarCheck, FaMedal, FaCheckCircle, FaStar } from 'react-icons/fa';

export default function DailyCheckIn() {
  const { user } = useContext(UserContext);
  const [status, setStatus] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) return;
      const res = await getCheckInStatus(user.uid);
      setHasCheckedIn(res.hasCheckedIn);
      setStreak(res.streak);
      setPoints(res.points);
      setLoading(false);
    };
    checkStatus();
  }, [user]);

  const onCheckIn = async () => {
    if (!user) return;
    const res = await handleDailyCheckIn(user.uid);
    setHasCheckedIn(true);
    setStreak(res.streak);
    setPoints(res.points);
    setStatus(`${res.message}`);
  };

  if (loading) return <Spinner animation="border" size="sm" />;

  return (
    <Card className="shadow-sm p-4 rounded-4 fade-in" style={{ background: '#fdfdfd', border: 'none' }}>
      <Card.Body className="text-center">
        <h5 className="fw-bold mb-4">🌿 Daily Check-In</h5>

        <div className="mb-3">
          <Badge bg="primary" className="p-2 fs-6">
            <FaMedal className="me-1" /> Total Points: {points}
          </Badge>
        </div>

        <div className="streak-display mb-4">
          <div className="streak-circle glow">
            <FaFire size={40} className="text-danger mb-2" />
            <h1 className="fw-bold mb-0">{streak}</h1>
            <small className="text-muted">Day Streak</small>
          </div>
        </div>

        {hasCheckedIn ? (
          <Alert variant="success" className="fade-in mb-3">
            <FaCheckCircle className="me-2 text-success" /> You've already checked in today!
          </Alert>
        ) : (
          <>
            <Button variant="success" size="lg" className="rounded-pill px-5 mb-3 shadow-sm" onClick={onCheckIn}>
              <FaCalendarCheck className="me-2" /> Check In Now
            </Button>

            {status && (
              <Alert variant="info" className="fade-in">
                {status} <FaStar className="text-warning ms-2" /> Streak: {streak} | Points: {points}
              </Alert>
            )}
          </>
        )}
      </Card.Body>

      <style>{`
        .streak-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ffffff, #f8f9fa);
          border: 3px solid #eee;
          border-radius: 50%;
          width: 150px;
          height: 150px;
          margin: 0 auto;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          position: relative;
        }
        .glow::after {
          content: "";
          position: absolute;
          top: -5px;
          bottom: -5px;
          left: -5px;
          right: -5px;
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(255,100,100,0.35);
          z-index: -1;
          animation: pulseGlow 2.5s infinite;
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 8px rgba(255,100,100,0.3); }
          50% { box-shadow: 0 0 16px rgba(255,100,100,0.5); }
          100% { box-shadow: 0 0 8px rgba(255,100,100,0.3); }
        }
        .fade-in {
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Card>
  );
}

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const DailyWellnessSurvey = ({ show, handleClose }) => {
  const [rating, setRating] = useState(null);
  const [goal, setGoal] = useState('');
  const [data, setData] = useState([]);

  const handleSubmit = () => {
    const today = new Date().toLocaleDateString();
    const newEntry = { day: today, wellness: rating };
    setData([...data, newEntry]);
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      container={document.body} // Ensures modal renders at the body level
      backdrop="static"
      keyboard={false}
      style={{ zIndex: 1055 }} // Ensures it has a higher z-index than the backdrop
    >
      <Modal.Header closeButton>
        <Modal.Title>How Well Are You Feeling Today?</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <div className="mb-3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span role="img" aria-label="sad" style={{ fontSize: '2rem' }}>😞</span>
            {[...Array(10)].map((_, i) => (
              <Button
                key={i + 1}
                variant={rating === i + 1 ? 'success' : 'outline-dark'}
                className="m-1"
                onClick={() => setRating(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <span role="img" aria-label="happy" style={{ fontSize: '2rem' }}>😊</span>
          </div>
        </div>

        <Form.Group>
          <Form.Label>Write Something Down for Today:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Set a goal or intention..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </Form.Group>

        {data.length > 0 && (
          <div style={{ width: '100%', height: 300, marginTop: '30px' }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="wellness" stroke="#F4A623" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit} disabled={!rating}>
          Save Entry
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DailyWellnessSurvey;

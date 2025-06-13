import React from 'react';
import { Card } from 'react-bootstrap';

function ProfileHeader({ user }) {
  return (
    <Card className="mb-3">
      <Card.Body className="d-flex align-items-center">
        <img
          src={user.profilePicUrl}
          alt="Profile"
          width="80"
          height="80"
          className="rounded-circle me-3"
          style={{ objectFit: 'cover' }}
        />
        <div>
          <h4>{user.displayName || 'Unnamed User'}</h4>
          <p className="text-muted mb-0">{user.bio}</p>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProfileHeader;

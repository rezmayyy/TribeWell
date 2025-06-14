import React from 'react';
import { Card } from 'react-bootstrap';
import ProfileBG from '../assets/ProfileBG.png';

function ProfileHeader({ user }) {
  return (
    <Card className="mb-3" style={{
      backgroundImage: `url(${ProfileBG})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <Card.Body className="d-flex flex-column align-items-center text-center" style={{ borderRadius: '0.5rem' }}>
        <img
          src={user.profilePicUrl}
          alt="Profile"
          width="300"
          height="300"
          className="rounded-circle mb-3"
          style={{ objectFit: 'cover' }}
        />
        <div>
          <h4>{user.displayName || 'Unnamed User'}</h4>
          <p className="text-muted mb-0">{user.bio}</p>
          <p className="text-muted mb-0">{user.interests}</p>
          {user.contacts?.map((contact, index) => (
            <p className="text-muted mb-0" key={index}>{contact}</p>
          ))}        
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProfileHeader;

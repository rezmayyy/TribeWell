import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/Firebase';

function ProfilePage() {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfileUser({ id: docSnap.id, ...docSnap.data() });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;
  if (!profileUser) return <p>User not found.</p>;

  return (
    <div>
      <h2>{profileUser.displayName || profileUser.id}'s Profile</h2>
      <p>Email: {profileUser.email}</p>
      {/* Add more user details or posts here */}
    </div>
  );
}

export default ProfilePage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserInfo } from '../services/fetchUserInfo';
import { fetchUserPosts } from '../services/fetchUserPosts';
import ProfileHeader from '../components/ProfileHeader';
import ProfilePosts from '../components/ProfilePosts';
import PageLoader from '../components/PageLoader';

function ProfilePage() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const user = await fetchUserInfo(userId);
      if (user) {
        setUserData(user);
        const posts = await fetchUserPosts(userId);
        setUserPosts(posts);
      }
      setLoading(false);
    };

    loadProfile();
  }, [userId]);

  if (loading) return <PageLoader />;
  if (!userData) return <p>User not found.</p>;

  return (
    <div className="container mt-4">
      <ProfileHeader user={userData} />
      <hr />
      <ProfilePosts posts={userPosts} />
    </div>
  );
}

export default ProfilePage;

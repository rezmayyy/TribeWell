import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserInfo } from '../services/fetchUserInfo';
import { fetchUserPosts } from '../services/fetchUserPosts';
import ProfileHeader from '../components/ProfileHeader';
import ProfilePosts from '../components/ProfilePosts';
import PageLoader from '../components/PageLoader';
import { Card, Tabs, Tab } from 'react-bootstrap';

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

      <Card className="mb-4">
        <Card.Body>
          <Card.Title style={{ fontSize: '2rem' }}>
            View My Posts
          </Card.Title>
          <Card.Text className="text-muted">
            Check out all the content I've posted!
          </Card.Text>
        </Card.Body>
      </Card>

      <Tabs defaultActiveKey="about" id="profile-tabs" className="mb-3">
        <Tab eventKey="about" title="About" className="mb-5">
          <p>This is the About tab. Add user details here later.</p>
          <a href="https://rezmayyy.github.io/MyWebsite/" target="_blank" rel="noopener noreferrer">
            Visit My Website!
          </a>
        </Tab>
        <Tab eventKey="posts" title="Posts" className="mb-5">
          <ProfilePosts posts={userPosts} />
        </Tab>
        <Tab eventKey="courses" title="Courses" className="mb-5">
          <p>Coming soon: Courses.</p>
        </Tab>
        <Tab eventKey="events" title="Events" className="mb-5">
          <p>Coming soon: Events.</p>
        </Tab>
        <Tab eventKey="followers" title="Followers" className="mb-5">
          <p>Coming soon: Followers List.</p>
        </Tab>
        <Tab eventKey="following" title="Following" className="mb-5">
          <p>Coming soon: Following List.</p>
        </Tab>
        <Tab eventKey="discussion" title="Discussion" className="mb-5">
          <p>Coming soon: Discussions.</p>
        </Tab>
      </Tabs>
    </div>
  );
}

export default ProfilePage;

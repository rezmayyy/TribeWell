import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Card } from 'react-bootstrap';
import UserContext from '../contexts/UserContext';
import { fetchFollowedUsers } from '../services/fetchFollowedUsers';
import { fetchFeedPosts } from '../services/fetchFeedPosts';
import PostCard from '../components/PostCard';
import DailyCheckIn from "../components/DailyCheckIn";
import PageLoader from '../components/PageLoader';
import FollowedUsersSidebar from '../components/FollowedUsersSidebar';

function HomePage() {
  const { user } = useContext(UserContext);

  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedLoading, setFeedLoading] = useState(true);

  const FOLLOW_LIMIT = 50;
  const POST_LIMIT = 10;

  useEffect(() => {
    if (!user) return;

    const loadInitial = async () => {
      setLoading(true);
      setFeedLoading(true);

      // Fetch a broader list of followed users for better post coverage
      const users = await fetchFollowedUsers(user.uid, FOLLOW_LIMIT, 0);
      const followedIds = users.map(u => u.id);

      const posts = await fetchFeedPosts(followedIds, POST_LIMIT);
      setFeedPosts(posts);

      setLoading(false);
      setFeedLoading(false);
    };

    loadInitial();
  }, [user]);

  if (!user) return <p>Please log in to see your homepage.</p>;
  if (loading) return <PageLoader />;

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Left Sidebar: Followed Users */}
        <Col md={3} className="sticky-top" style={{ top: '80px', alignSelf: 'start', zIndex: 1 }}>
          <FollowedUsersSidebar userId={user.uid} />
        </Col>

        {/* Middle Feed: Posts from followed users */}
        <Col md={6}>
          <h2>Keep up with everyone's journey.</h2>
          {feedLoading ? (
            <Spinner animation="border" />
          ) : feedPosts.length === 0 ? (
            <p>No recent posts from followed users.</p>
          ) : (
            feedPosts.map(post => <PostCard key={post.id} post={post} />)
          )}
        </Col>

        {/* Right Sidebar (Optional) */}
        <Col md={3} className="sticky-top" style={{ top: '80px', alignSelf: 'start', zIndex: 1 }}>
          <Card>
            <Card.Body>
              <Card.Title>Daily Check-In</Card.Title>
              <DailyCheckIn />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;

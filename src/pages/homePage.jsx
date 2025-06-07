import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Spinner } from 'react-bootstrap';
import UserContext from '../contexts/UserContext';
import { fetchFollowedUsers } from '../services/fetchFollowedUsers';
import { fetchFeedPosts } from '../services/fetchFeedPosts';
import PostCard from '../components/PostCard';
import DailyCheckIn from "../components/DailyCheckIn";
import PageLoader from '../components/PageLoader';

function HomePage() {
  const { user } = useContext(UserContext);

  const [followedUsers, setFollowedUsers] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedLoading, setFeedLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [batchIndex, setBatchIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 10;

  useEffect(() => {
    if (!user) return;

    const loadInitial = async () => {
      setLoading(true);
      setFeedLoading(true);

      const users = await fetchFollowedUsers(user.uid, LIMIT, 0);
      setFollowedUsers(users);
      setBatchIndex(LIMIT);
      setHasMore(users.length === LIMIT);

      const followedIds = users.map(u => u.id);
      const posts = await fetchFeedPosts(followedIds, LIMIT);
      setFeedPosts(posts);

      setLoading(false);
      setFeedLoading(false);
    };

    loadInitial();
  }, [user]);

  const loadMore = async () => {
    setLoadingMore(true);
    const newUsers = await fetchFollowedUsers(user.uid, LIMIT, batchIndex);
    setFollowedUsers(prev => [...prev, ...newUsers]);
    setBatchIndex(prev => prev + LIMIT);
    if (newUsers.length < LIMIT) setHasMore(false);
    setLoadingMore(false);
  };

  if (!user) return <p>Please log in to see your homepage.</p>;
  if (loading) return <PageLoader />;

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Left Sidebar: Followed Users */}
        <Col md={3} className="sticky-top" style={{ top: '80px', alignSelf: 'start', zIndex: 1 }}>
          <Card>
            <Card.Body>
              <Card.Title>Following</Card.Title>
              {followedUsers.length === 0 ? (
                <p>You’re not following anyone yet.</p>
              ) : (
                <>
                  <ListGroup variant="flush">
                    {followedUsers.map(f => (
                      <ListGroup.Item key={f.id}>
                        {f.displayName || f.id}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  {hasMore && (
                    <div className="text-center mt-2">
                      <Button
                        onClick={loadMore}
                        variant="outline-primary"
                        size="sm"
                        disabled={loadingMore}
                      >
                        {loadingMore ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Loading...
                          </>
                        ) : (
                          'Load More'
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
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

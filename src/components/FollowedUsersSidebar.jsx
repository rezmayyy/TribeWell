import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchFollowedUsers } from '../services/fetchFollowedUsers';

const LIMIT = 7;  // Change amount of people shown in following list

function FollowedUsersSidebar({ userId }) {
  const [followedUsers, setFollowedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [batchIndex, setBatchIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const loadInitial = async () => {
      setLoading(true);
      const users = await fetchFollowedUsers(userId, LIMIT, 0);
      setFollowedUsers(users);
      setBatchIndex(LIMIT);
      setHasMore(users.length === LIMIT);
      setLoading(false);
    };

    loadInitial();
  }, [userId]);

  const loadMore = async () => {
    setLoadingMore(true);
    const newUsers = await fetchFollowedUsers(userId, LIMIT, batchIndex);
    setFollowedUsers(prev => [...prev, ...newUsers]);
    setBatchIndex(prev => prev + LIMIT);
    if (newUsers.length < LIMIT) setHasMore(false);
    setLoadingMore(false);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Your Healers</Card.Title>
        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : followedUsers.length === 0 ? (
          <p>You’re not following anyone yet.</p>
        ) : (
          <>
            <ListGroup variant="flush">
              {followedUsers.map(f => (
                <ListGroup.Item key={f.id}>
                  <Link to={`/profile/${f.id}`} className="text-decoration-none">
                    {f.displayName || f.id}
                  </Link>
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
  );
}

export default FollowedUsersSidebar;

import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Card, Image, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import { fetchFollowedUsers } from '../services/fetchFollowedUsers';
import { fetchFeedPosts } from '../services/fetchFeedPosts';
import PostCard from '../components/PostCard';
import DailyCheckIn from "../components/DailyCheckIn";
import PageLoader from '../components/PageLoader';
import HomeHeader from '../components/home/homeHeader';

function HomePage() {
  const { user } = useContext(UserContext);
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedLoading, setFeedLoading] = useState(true);
  const [healers, setHealers] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const navigate = useNavigate();

  const FOLLOW_LIMIT = 50;
  const POST_LIMIT = 10;

  useEffect(() => {
    if (!user) return;

    const loadInitial = async () => {
      setLoading(true);
      setFeedLoading(true);
      const users = await fetchFollowedUsers(user.uid, FOLLOW_LIMIT, 0);
      const followedIds = users.map(u => u.id);
      const posts = await fetchFeedPosts(followedIds, POST_LIMIT);
      setFeedPosts(posts);
      setHealers(users);
      setLoading(false);
      setFeedLoading(false);
    };

    loadInitial();
  }, [user]);

  // Listen for scroll to toggle button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!user) return <p>Please log in to see your homepage.</p>;
  if (loading) return <PageLoader />;

  const sortedHealers = [...healers].sort((a, b) => {
    const nameA = (a.displayName || '').toLowerCase();
    const nameB = (b.displayName || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <HomeHeader />
      <Row className="mt-4 justify-content-center">

        {/* Left Sidebar */}
        <Col lg={3} md={4} sm={12} className="mb-4">
          <Card className="shadow-sm rounded-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="fw-bold mb-0">Your Healers</Card.Title>
                <Badge bg="secondary">{healers.length}</Badge>
              </div>

              {healers.length === 0 ? (
                <p className="text-muted">You are not following any healers yet.</p>
              ) : (
                <div className="d-flex flex-column">
                  {sortedHealers.map((healer, index) => (
                    <React.Fragment key={healer.id}>
                      <Link to={`/profile/${healer.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div
                          className="d-flex align-items-center px-2 py-2 rounded-3"
                          style={{ transition: 'transform 0.2s ease, background-color 0.3s, box-shadow 0.3s' }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = '#f1f1f1';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = '';
                            e.currentTarget.style.boxShadow = '';
                            e.currentTarget.style.transform = '';
                          }}
                        >
                          <Image
                            src={healer.profilePicUrl || `https://picsum.photos/50/50?random=${Math.random()}`}
                            roundedCircle
                            width={50}
                            height={50}
                            style={{ objectFit: 'cover', marginRight: '10px' }}
                          />
                          <div className="d-flex flex-column">
                            <div className="fw-bold mb-1">{healer.displayName || 'Unknown Healer'}</div>
                            <div className="badge rounded-pill bg-secondary text-light small align-self-start">
                              Healer
                            </div>
                          </div>
                        </div>
                      </Link>
                      {index < sortedHealers.length - 1 && (
                        <hr style={{ margin: '8px 0', borderColor: '#ddd' }} />
                      )}
                    </React.Fragment>
                  ))}

                  <div className="d-flex justify-content-center mt-3">
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={() => navigate('/directory')}
                      style={{ borderRadius: '50px', padding: '6px 20px' }}
                    >
                      Find More Healers
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Center Feed */}
        <Col lg={6} md={8} sm={12}>
          <h2 className="mb-4 text-center fw-bold" style={{ fontSize: '2rem' }}>
            Keep up with everyone's journey
          </h2>
          {feedLoading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
            </div>
          ) : feedPosts.length === 0 ? (
            <p className="text-center text-muted">No recent posts from followed users.</p>
          ) : (
            feedPosts.map(post => (
              <Card 
                className="mb-4 shadow-sm rounded-4 fade-in" 
                key={post.id} 
                style={{ border: 'none', backgroundColor: '#FFFFFF' }}
              >
                <Card.Body>
                  <PostCard post={post} />
                </Card.Body>
              </Card>
            ))
          )}
        </Col>

        {/* Right Sidebar */}
        <Col lg={3} md={4} sm={12} className="mt-4 mt-md-0">
          <Card className="shadow-sm rounded-4">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Daily Check-In</Card.Title>
              <DailyCheckIn />
            </Card.Body>
          </Card>
        </Col>

      </Row>

      {/* Scroll To Top Button */}
      {showScrollTop && (
        <Button 
          onClick={scrollToTop} 
          variant="primary"
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 999
          }}
        >
          ↑
        </Button>
      )}

      {/* Fade-in Animation */}
      <style>
        {`
          .fade-in {
            animation: fadeIn 0.5s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Container>
  );
}

export default HomePage;

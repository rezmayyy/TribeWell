import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserInfo } from '../services/fetchUserInfo';
import { fetchUserPosts } from '../services/fetchUserPosts';
import ProfileHeader from '../components/ProfileHeader';
import ProfilePosts from '../components/ProfilePosts';
import PageLoader from '../components/PageLoader';
import { Card, Tabs, Tab, Container, Row, Col } from 'react-bootstrap';

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
    <Container fluid className="py-4" style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm rounded-4 fade-in">
            <Card.Body className="p-4">
              <ProfileHeader user={userData} />

              <div className="my-4">
                <h3 className="fw-bold mb-1 text-center">{userData.displayName}</h3>
                <p className="text-center text-muted">{userData.email}</p>
              </div>

              <Tabs
                defaultActiveKey="about"
                id="profile-tabs"
                className="mb-3 justify-content-center modern-tabs"
                variant="pills"
              >
                <Tab eventKey="about" title="About" className="py-4">
                  <div className="text-center">
                    <p>This is the About tab. Add user details here later.</p>
                    <a
                      href="https://rezmayyy.github.io/MyWebsite/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary mt-2 rounded-pill px-4"
                    >
                      Visit My Website
                    </a>
                  </div>
                </Tab>

                <Tab eventKey="posts" title="Posts" className="py-4">
                  <ProfilePosts posts={userPosts} />
                </Tab>

                <Tab eventKey="courses" title="Courses" className="py-4">
                  <p className="text-center">Coming soon: Courses.</p>
                </Tab>

                <Tab eventKey="events" title="Events" className="py-4">
                  <p className="text-center">Coming soon: Events.</p>
                </Tab>

                <Tab eventKey="followers" title="Followers" className="py-4">
                  <p className="text-center">Coming soon: Followers List.</p>
                </Tab>

                <Tab eventKey="following" title="Following" className="py-4">
                  <p className="text-center">Coming soon: Following List.</p>
                </Tab>

                <Tab eventKey="discussion" title="Discussion" className="py-4">
                  <p className="text-center">Coming soon: Discussions.</p>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        .fade-in {
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modern-tabs .nav-link {
          border-radius: 50px !important;
          padding: 10px 20px;
          margin: 0 5px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .modern-tabs .nav-link.active {
          background: #5c6bc0 !important;
          color: #fff !important;
        }
        .modern-tabs .nav-link:hover {
          background: #e9ecef;
        }
      `}</style>
    </Container>
  );
}

export default ProfilePage;

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaLeaf, FaHeart } from 'react-icons/fa'; // Optional: healing icons

const HomeHeader = () => {
    return (
        <header
            style={{
                background: 'linear-gradient(92.06deg, rgba(244, 166, 35, 0.8) 19.66%, rgba(89, 84, 166, 0.8) 80.36%)', // Adjusted opacity with rgba
                padding: '50px 0',
                color: '#2c3e50',
                textAlign: 'center',
            }}
        >
            <Container>
                <Row className="align-items-center">
                    <Col md={12}>
                        <div
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.3)', // Black with 50% opacity
                                padding: '30px',
                                borderRadius: '10px',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Optional: add a shadow to make the text pop
                            }}
                        >
                            <h1
                                style={{
                                    fontSize: '3rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    marginBottom: '15px',
                                }}
                            >
                                Welcome to Your <span style={{ color: '#F4A623' }}>Wellness</span> Journey
                            </h1>

                            <p style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '20px', }} >
                                Connecting you with <span style={{ color: '#F4A623' }}>healing</span>, <span style={{ color: '#F4A623' }}>growth</span>, and <span style={{ color: '#F4A623' }}>community</span>.
                            </p>

                            <Button
                                style={{
                                    fontSize: '1.25rem',
                                    padding: '10px 20px',
                                    backgroundColor: '#F4A623',
                                    border: 'none',
                                    borderRadius: '50px',
                                    color: 'white',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = '#d99017')} // Slightly darker shade
                                onMouseLeave={(e) => (e.target.style.backgroundColor = '#F4A623')}
                            >
                                Daily Wellness Survey
                            </Button>

                        </div>
                    </Col>
                </Row>
            </Container>
        </header>
    );
};

export default HomeHeader;

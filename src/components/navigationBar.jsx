import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import UserContext from '../contexts/UserContext';
import Signout from './Signout'
import Logo from '../assets/TribeWellLogo.png';
import dummyPic from '../assets/dummyPic.jpeg';

import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import './AppNavbar.css';

function AppNavbar() {

    const { user } = useContext(UserContext);

    return (
        <Navbar bg="light" expand="lg" sticky="top">
            <Container>
                {/* Left: Brand */}
                <Navbar.Brand as={Link} to="/test" className="d-flex align-items-center">
                    <img
                        src={Logo}
                        alt="TribeWell Logo"
                        width="40"
                        height="40"
                        className="d-inline-block align-top me-2"
                    />
                    <span className="site-title">TribeWell</span>
                </Navbar.Brand>

                {/* Toggle for mobile */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    {/* Center: Nav links */}
                    <Nav className="mx-auto d-flex justify-content-center">
                        <Nav.Link as={Link} to="/home">Home</Nav.Link>
                        <Nav.Link as={Link} to="/test">Test</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                    </Nav>

                    {/* Right: Auth/Profile controls in fixed-width wrapper */}
                    <div style={{ minWidth: "300px" }} className="d-flex justify-content-end align-items-center">
                        {user ? (
                            <>
                                <Link to="/profile" className="d-flex align-items-center text-decoration-none me-3">
                                    <img
                                        src={user.profilePicUrl || dummyPic}
                                        alt="Profile"
                                        className="rounded-circle"
                                        width="36"
                                        height="36"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <span className="ms-2">{user.displayName || 'Profile'}</span>
                                </Link>
                                <Signout className="btn btn-outline-danger" />
                            </>
                        ) : (
                            <Button as={Link} to="/login" variant="outline-primary">
                                Log In
                            </Button>
                        )}

                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );
}

export default AppNavbar;

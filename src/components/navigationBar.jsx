import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

import UserContext from '../contexts/UserContext';
import Signout from './Signout';
import Logo from '../assets/TribeWellLogo.png';
import dummyPic from '../assets/dummyPic.jpeg';

import './AppNavbar.css';

function AppNavbar() {
    const { user } = useContext(UserContext);

    return (
        <Navbar bg="light" expand="lg" sticky="top">
            <Container>

                {/* LEFT: Brand */}
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <img
                        src={Logo}
                        alt="TribeWell Logo"
                        width="40"
                        height="40"
                        className="d-inline-block align-top me-2"
                    />
                    <span className="site-title">TribeWell</span>
                </Navbar.Brand>

                {/* TOGGLE (Mobile) */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <div className="d-flex justify-content-between align-items-center w-100 flex-wrap">
                        {/* Center Nav */}
                        <Nav className="mx-auto my-2 my-lg-0">
                            <Nav.Link as={NavLink} to="/home">Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/test">Test</Nav.Link>
                            <Nav.Link as={NavLink} to="/create">Create</Nav.Link>
                        </Nav>

                        {/* Right Auth */}
                        <div
                            style={{ width: '220px' }}
                            className="d-flex justify-content-end align-items-center"
                        >
                            {user ? (
                                <>
                                    <Link to={`/profile/${user.uid}`} className="d-flex align-items-center text-decoration-none me-2">
                                        <img
                                            src={user.profilePicUrl || dummyPic}
                                            alt="Profile"
                                            className="rounded-circle"
                                            width="36"
                                            height="36"
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <span className="ms-2 text-nowrap">{user.displayName || 'Profile'}</span>
                                    </Link>
                                    <Signout
                                        className="btn btn-outline-danger btn-sm text-nowrap"
                                        style={{ lineHeight: '1', height: '36px', padding: '6px 12px' }}
                                    />
                                </>
                            ) : (
                                <Button as={Link} to="/login" variant="outline-primary" className="ms-auto">
                                    Log In
                                </Button>
                            )}
                        </div>
                    </div>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
}

export default AppNavbar;

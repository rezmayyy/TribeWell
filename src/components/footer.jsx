import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start mt-5 py-5">
      <Container>
        <Row>
          <Col md={6} className="text-md-start text-center mb-2 mb-md-0">
            <span>&copy; {new Date().getFullYear()} Tribewell</span>
          </Col>
          <Col md={6} className="text-md-end text-center">
            <Link to="/privacy" className="text-decoration-none me-3">Privacy Policy</Link>
            <Link to="/terms" className="text-decoration-none">Terms of Service</Link>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;

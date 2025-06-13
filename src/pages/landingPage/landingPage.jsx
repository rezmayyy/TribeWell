import { Container, Row, Col } from 'react-bootstrap';
import CTA from './CTA';
import TreePose from './treePose.png'


function LandingPage() {

    return (
        <main className="landing-page">
            <section className="landing-page-hero">
                <CTA />
            </section>
            <section className="landing-page-about">
                <Container>
                    <Row className="align-items-center bg-light mb-5">
                        <Col md={6} className="bg-dark d-flex justify-content-center" style={{ borderRadius: '50px' }}>
                            <img src={TreePose} alt="Yoga pose" style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px'}} />
                        </Col>
                        <Col md={6}>
                            <h2>What’s this about...?</h2>
                            <p>
                                In a world that often feels disconnected, the Holistic Healer Directory App bridges the gap.
                                We connect you with healers who understand your unique cultural, spiritual, and emotional journey.
                                Whether you seek peace, healing, or a deeper connection to your identity, you’ll find a healer
                                who gets it — all for free to start.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>
        </main>
    )
}

export default LandingPage;
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { auth } from "../services/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import UserContext from "../contexts/UserContext";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // reset previous errors

        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            setUser(user);
            navigate("/");
        } catch (err) {
            switch (err.code) {
                case "auth/user-disabled":
                    setError("Your account has been disabled. Contact support.");
                    break;
                case "auth/too-many-requests":
                    setError("Too many login attempts — please try again later.");
                    break;
                case "auth/invalid-email":
                case "auth/user-not-found":
                case "auth/wrong-password":
                default:
                    setError("Invalid email or password.");
            }
            console.error(err.code, err.message);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Row className="w-100">
                <Col md={6} lg={4} className="mx-auto">
                    <div className="p-4 border rounded shadow-sm">
                        <h1 className="text-center mb-4">Login</h1>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formEmail" className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <div className="input-group">
                                    <div className="input-group-text">
                                        <FaUser />
                                    </div>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group controlId="formPassword" className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <div className="input-group">
                                    <div className="input-group-text">
                                        <FaLock />
                                    </div>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </Form.Group>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Button variant="primary" type="submit" block>
                                Login
                            </Button>
                        </Form>

                        <div className="mt-3 text-center">
                            <p>
                                Don’t have an account? <Link to="/signup">Sign Up</Link>
                            </p>
                            <Link to="/recover">Forgot password?</Link>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;

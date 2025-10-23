import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCommentDots, FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="auth-card border-0 shadow-lg">
              <Row className="g-0">
                <Col lg={6} className="auth-left d-flex align-items-center justify-content-center text-center p-5 bg-primary text-white">
                  <div>
                    <FaCommentDots size={80} className="mb-4" />
                    <h2 className="mb-4">Welcome Back!</h2>
                    <p className="lead">
                      Login to access your Campus Voice account and continue making your voice heard.
                    </p>
                  </div>
                </Col>

                <Col lg={6} className="auth-right p-5">
                  <div className="text-center mb-4">
                    <h3>Login to Your Account</h3>
                    <p className="text-muted">Enter your credentials to continue</p>
                  </div>

                  {error && (
                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                      <FaCommentDots className="me-2" />
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaEnvelope />
                        </span>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaLock />
                        </span>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Remember me"
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <FaSignInAlt className="me-2" />
                          Login
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="mb-0">
                        Don't have an account? <Link to="/register">Register here</Link>
                      </p>
                      <Link to="/forgot-password" className="text-muted small">
                        Forgot Password?
                      </Link>
                    </div>
                  </Form>
                </Col>
              </Row>
            </Card>

            <div className="text-center mt-3">
              <Link to="/" className="text-muted text-decoration-none">
                <FaCommentDots className="me-2" />
                Back to Home
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;

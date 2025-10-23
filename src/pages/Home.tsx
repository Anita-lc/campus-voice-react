import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaComments,
  FaCommentDots,
  FaTasks, 
  FaUserShield, 
  FaRobot, 
  FaHashtag, 
  FaPoll,
  FaGraduationCap,
  FaBuilding,
  FaBed,
  FaBook,
  FaLaptop,
  FaUtensils,
  FaFutbol,
  FaHeartbeat,
  FaBus,
  FaShieldAlt,
  FaUserTie,
  FaEllipsisH
} from 'react-icons/fa';

const Home: React.FC = () => {
  const features = [
    {
      icon: <FaComments />,
      title: 'Submit Feedback',
      description: 'Easily submit feedback, complaints, or suggestions through our intuitive form.'
    },
    {
      icon: <FaTasks />,
      title: 'Track Status',
      description: 'Monitor the progress of your submissions in real-time from submission to resolution.'
    },
    {
      icon: <FaUserShield />,
      title: 'Anonymous Posting',
      description: 'Share your concerns anonymously while maintaining privacy and security.'
    },
    {
      icon: <FaRobot />,
      title: 'AI-Powered Detection',
      description: 'Smart duplicate detection prevents redundant submissions and suggests similar posts.'
    },
    {
      icon: <FaHashtag />,
      title: 'Social Media Integration',
      description: 'Automatically tracks campus-related posts from social media platforms.'
    },
    {
      icon: <FaPoll />,
      title: 'Polls & Surveys',
      description: 'Participate in campus surveys and vote on important decisions.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Create Account',
      description: 'Sign up with your campus credentials to get started.'
    },
    {
      number: '2',
      title: 'Submit Feedback',
      description: 'Fill out our simple form to share your feedback or concern.'
    },
    {
      number: '3',
      title: 'AI Verification',
      description: 'Our AI checks for duplicates and suggests similar posts.'
    },
    {
      number: '4',
      title: 'Track & Engage',
      description: 'Monitor status and engage with administrators for resolution.'
    }
  ];

  const categories = [
    { icon: <FaGraduationCap />, name: 'Academic Issues', color: '#4361ee' },
    { icon: <FaBuilding />, name: 'Infrastructure', color: '#3f37c9' },
    { icon: <FaBed />, name: 'Hostel & Accommodation', color: '#4cc9f0' },
    { icon: <FaBook />, name: 'Library Services', color: '#7209b7' },
    { icon: <FaLaptop />, name: 'IT & Technology', color: '#f72585' },
    { icon: <FaUtensils />, name: 'Food & Dining', color: '#4caf50' },
    { icon: <FaFutbol />, name: 'Sports & Recreation', color: '#ff9800' },
    { icon: <FaHeartbeat />, name: 'Health Services', color: '#f44336' },
    { icon: <FaBus />, name: 'Transportation', color: '#9c27b0' },
    { icon: <FaShieldAlt />, name: 'Safety & Security', color: '#e91e63' },
    { icon: <FaUserTie />, name: 'Administration', color: '#607d8b' },
    { icon: <FaEllipsisH />, name: 'Other', color: '#795548' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">Your Voice Matters on Campus</h1>
              <p className="lead mb-4">
                A centralized platform for students to voice concerns, provide feedback, 
                and engage with campus administration effectively.
              </p>
              <div className="d-flex gap-3 mb-5">
                <Button as={Link as any} to="/register" variant="light" size="lg">
                  Get Started
                </Button>
                <Button as={Link as any} to="#features" variant="outline-light" size="lg">
                  Learn More
                </Button>
              </div>
              <Row className="stats-row">
                <Col md={4}>
                  <div className="text-center">
                    <h3 className="stat-number">500+</h3>
                    <p className="stat-label">Active Users</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <h3 className="stat-number">1,200+</h3>
                    <p className="stat-label">Feedback Submitted</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <h3 className="stat-number">85%</h3>
                    <p className="stat-label">Resolution Rate</p>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col lg={6}>
              <div className="hero-image text-center">
                <FaComments size={200} className="text-white-50" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <Container>
          <h2 className="text-center mb-5">Key Features</h2>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col md={4} key={index}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <div className="feature-icon mb-3 text-primary" style={{ fontSize: '2.5rem' }}>
                      {feature.icon}
                    </div>
                    <h4 className="mb-3">{feature.title}</h4>
                    <p className="text-muted">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>
          <Row className="g-4">
            {steps.map((step, index) => (
              <Col md={3} key={index}>
                <Card className="h-100 border-0 text-center">
                  <Card.Body className="p-4">
                    <div 
                      className="step-number rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        backgroundColor: '#007bff',
                        fontSize: '1.5rem'
                      }}
                    >
                      {step.number}
                    </div>
                    <h4 className="mb-3">{step.title}</h4>
                    <p className="text-muted">{step.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">Feedback Categories</h2>
          <Row className="g-4">
            {categories.map((category, index) => (
              <Col md={4} lg={3} key={index}>
                <Card className="h-100 border-0 shadow-sm hover-card">
                  <Card.Body className="p-3 text-center">
                    <div 
                      className="mb-3"
                      style={{ 
                        fontSize: '2rem',
                        color: category.color
                      }}
                    >
                      {category.icon}
                    </div>
                    <h6 className="mb-0">{category.name}</h6>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2 className="mb-4">About Campus Voice</h2>
              <p className="lead">
                Campus Voice is a web-based feedback system designed to bridge the communication 
                gap between students and university administration.
              </p>
              <p>
                Our platform aligns with SDG 16 (Peace, Justice, and Strong Institutions) and 
                SDG 4 (Quality Education) by promoting transparency, accountability, and efficient 
                problem resolution in higher education institutions.
              </p>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <FaComments className="text-success me-2" />
                  Centralized feedback management
                </li>
                <li className="mb-2">
                  <FaTasks className="text-success me-2" />
                  Real-time status tracking
                </li>
                <li className="mb-2">
                  <FaUserShield className="text-success me-2" />
                  Anonymous submission options
                </li>
                <li className="mb-2">
                  <FaRobot className="text-success me-2" />
                  AI-powered duplicate detection
                </li>
                <li className="mb-2">
                  <FaHashtag className="text-success me-2" />
                  Social media integration
                </li>
              </ul>
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <FaComments size={200} className="text-primary" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <Container className="text-center">
          <h2 className="mb-4">Ready to Make Your Voice Heard?</h2>
          <p className="lead mb-4">
            Join hundreds of students who are already improving campus life with their feedback.
          </p>
          <Button as={Link as any} to="/register" variant="light" size="lg">
            Get Started Now
          </Button>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-dark text-white">
        <Container>
          <Row>
            <Col md={4}>
              <h5>
                <FaCommentDots className="me-2" />
                Campus Voice
              </h5>
              <p>
                A platform designed to bridge the communication gap between students and 
                university administration through an efficient feedback system.
              </p>
            </Col>
            <Col md={4}>
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="#home" className="text-white-50 text-decoration-none">Home</a></li>
                <li><a href="#features" className="text-white-50 text-decoration-none">Features</a></li>
                <li><a href="#about" className="text-white-50 text-decoration-none">About</a></li>
                <li><Link to="/login" className="text-white-50 text-decoration-none">Login</Link></li>
                <li><Link to="/register" className="text-white-50 text-decoration-none">Register</Link></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>Contact Us</h5>
              <p><FaComments className="me-2" /> support@campusvoice.edu</p>
              <p><FaComments className="me-2" /> +1 (555) 123-4567</p>
            </Col>
          </Row>
          <hr className="mt-4" />
          <div className="text-center">
            <p className="mb-0">
              &copy; 2025 Campus Voice. All rights reserved. | Aligned with SDG 4 & SDG 16
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaComments, 
  FaClock, 
  FaSpinner, 
  FaCheckCircle, 
  FaPlus, 
  FaEye,
  FaInbox,
  FaBell
} from 'react-icons/fa';
import axios from 'axios';

interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  unreadNotifications: number;
}

interface Feedback {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  category: {
    name: string;
    icon: string;
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentFeedback, setRecentFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, feedbackResponse] = await Promise.all([
        axios.get('/dashboard/stats'),
        axios.get('/feedback?limit=5')
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      if (feedbackResponse.data.success) {
        setRecentFeedback(feedbackResponse.data.feedback);
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'warning', icon: FaClock },
      UNDER_REVIEW: { variant: 'info', icon: FaSpinner },
      IN_PROGRESS: { variant: 'primary', icon: FaSpinner },
      RESOLVED: { variant: 'success', icon: FaCheckCircle },
      REJECTED: { variant: 'danger', icon: FaClock }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const IconComponent = config.icon;

    return (
      <Badge bg={config.variant} className="d-flex align-items-center gap-1">
        <IconComponent size={12} />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      LOW: 'secondary',
      MEDIUM: 'primary',
      HIGH: 'warning',
      URGENT: 'danger'
    };

    return (
      <Badge bg={priorityConfig[priority as keyof typeof priorityConfig] || 'primary'}>
        {priority}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        {/* Sidebar */}
        <Col md={3} lg={2} className="px-0">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-3">
              <nav className="nav flex-column">
                <Link to="/dashboard" className="nav-link active">
                  <FaComments className="me-2" />
                  Dashboard
                </Link>
                <Link to="/submit-feedback" className="nav-link">
                  <FaPlus className="me-2" />
                  Submit Feedback
                </Link>
                <Link to="/my-feedback" className="nav-link">
                  <FaInbox className="me-2" />
                  My Feedback
                </Link>
                <Link to="/browse-feedback" className="nav-link">
                  <FaEye className="me-2" />
                  Browse Feedback
                </Link>
                <Link to="/polls" className="nav-link">
                  <FaComments className="me-2" />
                  Polls & Surveys
                </Link>
              </nav>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Welcome back, {user?.firstName}!</h2>
            <Button as={Link as any} to="/submit-feedback" variant="primary">
              <FaPlus className="me-2" />
              Submit Feedback
            </Button>
          </div>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Statistics Cards */}
          {stats && (
            <Row className="g-4 mb-4">
              <Col md={3}>
                <Card className="stat-card border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <div className="stat-card-icon primary mb-3">
                      <FaComments />
                    </div>
                    <h3 className="mb-1">{stats.total}</h3>
                    <p className="text-muted mb-0">Total Feedback</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stat-card border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <div className="stat-card-icon warning mb-3">
                      <FaClock />
                    </div>
                    <h3 className="mb-1">{stats.pending}</h3>
                    <p className="text-muted mb-0">Pending</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stat-card border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <div className="stat-card-icon primary mb-3">
                      <FaSpinner />
                    </div>
                    <h3 className="mb-1">{stats.inProgress}</h3>
                    <p className="text-muted mb-0">In Progress</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stat-card border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <div className="stat-card-icon success mb-3">
                      <FaCheckCircle />
                    </div>
                    <h3 className="mb-1">{stats.resolved}</h3>
                    <p className="text-muted mb-0">Resolved</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Recent Feedback */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Recent Feedback</h5>
            </Card.Header>
            <Card.Body>
              {recentFeedback.length === 0 ? (
                <div className="text-center py-5">
                  <FaInbox size={48} className="text-muted mb-3" />
                  <p className="text-muted">You haven't submitted any feedback yet.</p>
                  <Button as={Link as any} to="/submit-feedback" variant="primary">
                    Submit Your First Feedback
                  </Button>
                </div>
              ) : (
                <>
                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentFeedback.map((feedback) => (
                        <tr key={feedback.id}>
                          <td>
                            <strong>{feedback.title}</strong>
                          </td>
                          <td>
                            <FaComments className="me-1" />
                            {feedback.category.name}
                          </td>
                          <td>{getStatusBadge(feedback.status)}</td>
                          <td>{getPriorityBadge(feedback.priority)}</td>
                          <td>{formatDate(feedback.createdAt)}</td>
                          <td>
                            <Button
                              as={Link as any}
                              to={`/feedback/${feedback.id}`}
                              variant="outline-primary"
                              size="sm"
                            >
                              <FaEye />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="text-center mt-3">
                    <Button as={Link as any} to="/my-feedback" variant="outline-primary">
                      View All Feedback
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

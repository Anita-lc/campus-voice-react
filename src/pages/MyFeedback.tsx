import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Pagination, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaComments, FaEye, FaClock, FaSpinner, FaCheckCircle, FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';

interface Feedback {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  category: {
    name: string;
    icon: string;
  };
  _count: {
    comments: number;
    votes: number;
  };
}

const MyFeedback: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    categoryId: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchFeedback();
  }, [pagination.page, filters]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.categoryId && { categoryId: filters.categoryId })
      });

      const response = await axios.get(`/feedback?${params}`);
      
      if (response.data.success) {
        setFeedback(response.data.feedback);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages
        }));
      }
    } catch (err) {
      console.error('Feedback fetch error:', err);
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your feedback...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>My Feedback</h2>
            <Button as={Link as any} to="/submit-feedback" variant="primary">
              <FaComments className="me-2" />
              Submit New Feedback
            </Button>
          </div>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Filters */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="REJECTED">Rejected</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Search</Form.Label>
                    <Form.Control
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Search feedback..."
                    />
                  </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  <Button variant="outline-primary" onClick={fetchFeedback}>
                    <FaFilter className="me-2" />
                    Apply Filters
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Feedback List */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Your Feedback ({pagination.total} total)</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {feedback.length === 0 ? (
                <div className="text-center py-5">
                  <FaComments size={48} className="text-muted mb-3" />
                  <p className="text-muted">No feedback found matching your criteria.</p>
                  <Button as={Link as any} to="/submit-feedback" variant="primary">
                    Submit Your First Feedback
                  </Button>
                </div>
              ) : (
                <Table hover responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Comments</th>
                      <th>Votes</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedback.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div>
                            <strong>{item.title}</strong>
                            <br />
                            <small className="text-muted">
                              {item.description.length > 100 
                                ? `${item.description.substring(0, 100)}...` 
                                : item.description
                              }
                            </small>
                          </div>
                        </td>
                        <td>
                          <FaComments className="me-1" />
                          {item.category.name}
                        </td>
                        <td>{getStatusBadge(item.status)}</td>
                        <td>{getPriorityBadge(item.priority)}</td>
                        <td>
                          <Badge bg="secondary">
                            {item._count.comments}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="info">
                            {item._count.votes}
                          </Badge>
                        </td>
                        <td>
                          <small>{formatDate(item.createdAt)}</small>
                        </td>
                        <td>
                          <Button
                            as={Link as any}
                            to={`/feedback/${item.id}`}
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
              )}
            </Card.Body>
          </Card>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First 
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page === 1}
                />
                <Pagination.Prev 
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                />
                
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === pagination.pages || 
                    Math.abs(page - pagination.page) <= 2
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <Pagination.Ellipsis />
                      )}
                      <Pagination.Item
                        active={page === pagination.page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Pagination.Item>
                    </React.Fragment>
                  ))}
                
                <Pagination.Next 
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                />
                <Pagination.Last 
                  onClick={() => handlePageChange(pagination.pages)}
                  disabled={pagination.page === pagination.pages}
                />
              </Pagination>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyFeedback;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Alert, Modal } from 'react-bootstrap';
import { FaComments, FaEye, FaClock, FaSpinner, FaCheckCircle, FaFilter, FaSearch, FaEdit } from 'react-icons/fa';
import axios from 'axios';

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
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  _count: {
    comments: number;
    votes: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    categoryId: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

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
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.categoryId && { categoryId: filters.categoryId })
      });

      const response = await axios.get(`/admin/feedback?${params}`);
      
      if (response.data.success) {
        setFeedback(response.data.feedback);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages
        }));
      }
    } catch (err) {
      console.error('Admin feedback fetch error:', err);
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusUpdate = async () => {
    if (!selectedFeedback || !newStatus) return;

    try {
      setUpdating(true);
      const response = await axios.put(`/admin/feedback/${selectedFeedback.id}/status`, {
        status: newStatus,
        adminResponse: adminResponse || undefined
      });

      if (response.data.success) {
        setShowModal(false);
        setAdminResponse('');
        setNewStatus('');
        setSelectedFeedback(null);
        fetchFeedback();
      }
    } catch (err) {
      console.error('Status update error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const openStatusModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setNewStatus(feedback.status);
    setAdminResponse('');
    setShowModal(true);
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
          <p className="mt-3">Loading admin dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Admin Dashboard</h2>
            <div className="d-flex gap-2">
              <Badge bg="info" className="p-2">
                Total: {pagination.total}
              </Badge>
            </div>
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
                <Col md={3}>
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
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      name="priority"
                      value={filters.priority}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Priorities</option>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="categoryId"
                      value={filters.categoryId}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Categories</option>
                      {/* Categories would be loaded from API */}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end">
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
              <h5 className="mb-0">All Feedback</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {feedback.length === 0 ? (
                <div className="text-center py-5">
                  <FaComments size={48} className="text-muted mb-3" />
                  <p className="text-muted">No feedback found matching your criteria.</p>
                </div>
              ) : (
                <Table hover responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>User</th>
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
                          <div>
                            <strong>{item.user.firstName} {item.user.lastName}</strong>
                            <br />
                            <small className="text-muted">{item.user.email}</small>
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
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => openStatusModal(item)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                            >
                              <FaEye />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Status Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Feedback Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFeedback && (
            <div>
              <h6>Feedback: {selectedFeedback.title}</h6>
              <p className="text-muted mb-3">{selectedFeedback.description}</p>
              
              <Form.Group className="mb-3">
                <Form.Label>New Status</Form.Label>
                <Form.Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Admin Response (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Add a response or update for the user..."
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleStatusUpdate}
            disabled={updating || !newStatus}
          >
            {updating ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Updating...</span>
                </div>
                Updating...
              </>
            ) : (
              'Update Status'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Form, Spinner } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaComments, 
  FaClock, 
  FaSpinner, 
  FaCheckCircle, 
  FaThumbsUp, 
  FaThumbsDown,
  FaReply,
  FaArrowLeft,
  FaUser,
  FaUserShield
} from 'react-icons/fa';
import axios from 'axios';

interface Feedback {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  location?: string;
  isAnonymous: boolean;
  attachments?: string[];
  upvotes: number;
  views: number;
  adminResponse?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  category: {
    name: string;
    icon: string;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  comments: Comment[];
  votes: Vote[];
}

interface Comment {
  id: number;
  comment: string;
  isAdminResponse: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface Vote {
  id: number;
  voteType: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

const ViewFeedback: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchFeedback();
    }
  }, [id]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/feedback/${id}`);
      
      if (response.data.success) {
        setFeedback(response.data.feedback);
      } else {
        setError('Feedback not found');
      }
    } catch (err) {
      console.error('Feedback fetch error:', err);
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmittingComment(true);
      // Add comment API call would go here
      // For now, just add to local state
      const newComment: Comment = {
        id: Date.now(),
        comment: comment.trim(),
        isAdminResponse: false,
        createdAt: new Date().toISOString(),
        user: {
          firstName: 'You',
          lastName: '',
          role: 'STUDENT'
        }
      };
      
      setFeedback(prev => prev ? {
        ...prev,
        comments: [...prev.comments, newComment]
      } : null);
      
      setComment('');
    } catch (err) {
      console.error('Comment submission error:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleVote = async (voteType: 'UPVOTE' | 'DOWNVOTE') => {
    try {
      setVoting(true);
      // Vote API call would go here
      // For now, just update local state
      setFeedback(prev => prev ? {
        ...prev,
        upvotes: voteType === 'UPVOTE' ? prev.upvotes + 1 : Math.max(0, prev.upvotes - 1)
      } : null);
    } catch (err) {
      console.error('Vote error:', err);
    } finally {
      setVoting(false);
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading feedback...</p>
        </div>
      </Container>
    );
  }

  if (error || !feedback) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error || 'Feedback not found'}
        </Alert>
        <Button as={Link as any} to="/my-feedback" variant="primary">
          <FaArrowLeft className="me-2" />
          Back to My Feedback
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Button as={Link as any} to="/my-feedback" variant="outline-secondary">
              <FaArrowLeft className="me-2" />
              Back to My Feedback
            </Button>
            <div className="d-flex gap-2">
              {getStatusBadge(feedback.status)}
              {getPriorityBadge(feedback.priority)}
            </div>
          </div>

          {/* Main Feedback Card */}
          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h4 className="mb-1">{feedback.title}</h4>
                  <div className="d-flex align-items-center gap-3 text-muted">
                    <span>
                      <FaComments className="me-1" />
                      {feedback.category.name}
                    </span>
                    <span>
                      <FaUser className="me-1" />
                      {feedback.isAnonymous ? 'Anonymous' : `${feedback.user.firstName} ${feedback.user.lastName}`}
                    </span>
                    <span>
                      {formatDate(feedback.createdAt)}
                    </span>
                    <span>
                      {feedback.views} views
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => handleVote('UPVOTE')}
                    disabled={voting}
                  >
                    <FaThumbsUp className="me-1" />
                    {feedback.upvotes}
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleVote('DOWNVOTE')}
                    disabled={voting}
                  >
                    <FaThumbsDown />
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <p className="mb-3">{feedback.description}</p>
              
              {feedback.location && (
                <p className="text-muted mb-3">
                  <strong>Location:</strong> {feedback.location}
                </p>
              )}

              {feedback.attachments && feedback.attachments.length > 0 && (
                <div className="mb-3">
                  <h6>Attachments:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {feedback.attachments.map((attachment, index) => (
                      <Badge key={index} bg="secondary" className="p-2">
                        {attachment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {feedback.adminResponse && (
                <Alert variant="info" className="mt-3">
                  <div className="d-flex align-items-start">
                    <FaUserShield className="me-2 mt-1" />
                    <div>
                      <h6 className="mb-2">Admin Response</h6>
                      <p className="mb-0">{feedback.adminResponse}</p>
                      {feedback.resolvedAt && (
                        <small className="text-muted">
                          Resolved on {formatDate(feedback.resolvedAt)}
                        </small>
                      )}
                    </div>
                  </div>
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Comments Section */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                Comments ({feedback.comments.length})
              </h5>
            </Card.Header>
            <Card.Body>
              {/* Add Comment Form */}
              <Form onSubmit={handleCommentSubmit} className="mb-4">
                <Form.Group>
                  <Form.Label>Add a Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts on this feedback..."
                  />
                </Form.Group>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submittingComment || !comment.trim()}
                  className="mt-2"
                >
                  {submittingComment ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <FaReply className="me-2" />
                      Post Comment
                    </>
                  )}
                </Button>
              </Form>

              {/* Comments List */}
              {feedback.comments.length === 0 ? (
                <p className="text-muted text-center py-3">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                <div className="comments-list">
                  {feedback.comments.map((comment) => (
                    <div key={comment.id} className="comment-item mb-3 p-3 border rounded">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center">
                          {comment.isAdminResponse ? (
                            <FaUserShield className="me-2 text-primary" />
                          ) : (
                            <FaUser className="me-2 text-secondary" />
                          )}
                          <strong>
                            {comment.user.firstName} {comment.user.lastName}
                          </strong>
                          {comment.isAdminResponse && (
                            <Badge bg="primary" className="ms-2">Admin</Badge>
                          )}
                        </div>
                        <small className="text-muted">
                          {formatDate(comment.createdAt)}
                        </small>
                      </div>
                      <p className="mb-0">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewFeedback;

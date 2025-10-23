import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaComments, FaUpload, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const SubmitFeedback: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    location: '',
    priority: 'MEDIUM',
    isAnonymous: false
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('priority', formData.priority);
      formDataToSend.append('isAnonymous', formData.isAnonymous.toString());

      attachments.forEach((file, index) => {
        formDataToSend.append('attachments', file);
      });

      const response = await axios.post('/feedback', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to submit feedback');
      }
    } catch (err: any) {
      console.error('Feedback submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && formData.title && formData.description && formData.categoryId) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  if (success) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="text-center border-0 shadow">
              <Card.Body className="p-5">
                <FaCheckCircle size={80} className="text-success mb-4" />
                <h3 className="mb-3">Feedback Submitted Successfully!</h3>
                <p className="text-muted mb-4">
                  Your feedback has been submitted and is now under review. 
                  You'll receive notifications about any updates.
                </p>
                <Button variant="primary" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="border-0 shadow">
            <Card.Header className="bg-white">
              <h3 className="mb-0">
                <FaComments className="me-2" />
                Submit Feedback
              </h3>
              <p className="text-muted mb-0">Share your concerns and suggestions with campus administration</p>
            </Card.Header>
            <Card.Body className="p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Step {step} of 2</span>
                  <span className="text-muted">{Math.round((step / 2) * 100)}% Complete</span>
                </div>
                <ProgressBar now={(step / 2) * 100} variant="primary" />
              </div>

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {step === 1 && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Feedback Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Brief title for your feedback"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your feedback in detail..."
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Location (Optional)</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Where did this issue occur?"
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={nextStep}
                        disabled={!formData.title || !formData.description || !formData.categoryId}
                      >
                        Next Step
                      </Button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Priority Level</Form.Label>
                      <Form.Select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Attachments (Optional)</Form.Label>
                      <Form.Control
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                      <Form.Text className="text-muted">
                        You can upload images, PDFs, or documents (max 5MB each)
                      </Form.Text>
                    </Form.Group>

                    {attachments.length > 0 && (
                      <div className="mb-3">
                        <h6>Selected Files:</h6>
                        {attachments.map((file, index) => (
                          <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                            <span className="small">{file.name}</span>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        name="isAnonymous"
                        checked={formData.isAnonymous}
                        onChange={handleChange}
                        label="Submit anonymously"
                      />
                      <Form.Text className="text-muted">
                        Check this box if you want to submit this feedback anonymously
                      </Form.Text>
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={prevStep}
                      >
                        Previous
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="me-2" />
                            Submit Feedback
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SubmitFeedback;

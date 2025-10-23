import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCommentDots, FaBell, FaUser, FaSignOutAlt, FaCog, FaUserShield } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="shadow">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold">
          <FaCommentDots className="me-2" />
          Campus Voice
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/submit-feedback">
                  Submit Feedback
                </Nav.Link>
                <Nav.Link as={Link} to="/my-feedback">
                  My Feedback
                </Nav.Link>
                
                <Nav.Link as={Link} to="/notifications" className="position-relative">
                  <FaBell />
                  {/* Add notification badge here if needed */}
                </Nav.Link>
                
                <NavDropdown
                  title={
                    <span>
                      <FaUser className="me-1" />
                      {user.firstName}
                    </span>
                  }
                  id="user-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    <FaUser className="me-2" />
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/settings">
                    <FaCog className="me-2" />
                    Settings
                  </NavDropdown.Item>
                  
                  {user.role === 'ADMIN' && (
                    <NavDropdown.Item as={Link} to="/admin">
                      <FaUserShield className="me-2" />
                      Admin Panel
                    </NavDropdown.Item>
                  )}
                  
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn btn-light text-primary">
                  Get Started
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;

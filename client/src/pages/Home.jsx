import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  editProfile,
  fetchProfile,
  removeProfilePicture,
  uploadProfilePicture,
} from '../features/profileSlice';
import { logout } from '../features/authSlice';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TransactionList from '../components/TransactionList';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state) => state.profile);

  const [editMode, setEditMode] = useState(false); // Track if in edit mode
  const [showDetails, setShowDetails] = useState(false); // Track if profile details are shown
  const [username, setUsername] = useState(''); // Track edited username

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || ''); // Initialize username field
    }
  }, [user]);

  // Handle profile picture upload
  const handleUploadPicture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePicture', file);
      dispatch(uploadProfilePicture(formData));
    }
  };

  // Handle profile picture removal
  const handleRemovePicture = () => {
    dispatch(removeProfilePicture());
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Redirect to login page after logout
  };

  // Toggle edit mode and save changes
  const handleEditSave = () => {
    if (editMode) {
      // Save the edited profile
      dispatch(editProfile({ username }));
    }
    setEditMode(!editMode); // Toggle edit mode
  };

  return (
    <Container fluid>
      <Row>
        {/* Main Content Section */}
        <Col md={8}>
          <h1>Welcome to Home</h1>
          <p>This is the main content section of the page.</p>
        </Col>

        {/* Profile Section */}
        <Col md={4}>
          <Card>
            <Card.Header
              className="text-center"
              onClick={() => setShowDetails(!showDetails)}
              style={{ cursor: 'pointer' }}
            >
              {user && (
                <>
                  <img
                    src={user.profilePicture || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="img-fluid rounded-circle mb-2"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                  <h5 className="mb-0">{user.username || 'Anonymous User'}</h5>
                </>
              )}
            </Card.Header>
            {showDetails && (
              <Card.Body>
                {status === 'loading' && <p>Loading...</p>}
                {error && <p className="text-danger">{error}</p>}
                {user && (
                  <>
                    {editMode ? (
                      <Form.Group controlId="editUsername" className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </Form.Group>
                    ) : (
                      <p className="text-center text-muted">{user.email}</p>
                    )}

                    {/* Upload Profile Picture */}
                    <Form.Group controlId="uploadProfilePicture" className="mb-3">
                      <Form.Label>Upload New Picture</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleUploadPicture}
                      />
                    </Form.Group>

                    {/* Remove Profile Picture */}
                    <Button
                      variant="danger"
                      className="w-100 mb-3"
                      onClick={handleRemovePicture}
                    >
                      Remove Profile Picture
                    </Button>

                    {/* Edit/Save Profile Button */}
                    <Button
                      variant="primary"
                      className="w-100 mb-3"
                      onClick={handleEditSave}
                    >
                      {editMode ? 'Save Profile' : 'Edit Profile'}
                    </Button>

                    {/* Logout Button */}
                    <Button
                      variant="secondary"
                      className="w-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                )}
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
      <TransactionList/>
    </Container>
  );
};

export default Home;

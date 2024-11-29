import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signin } from '../features/authSlice';
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.auth);

    // State for form data and notifications
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [notification, setNotification] = useState({ message: '', type: '' });

    // Handle form field changes
    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification({ message: '', type: '' }); // Clear previous notifications

        try {
            // Dispatch the signin action
            await dispatch(signin(formData)).unwrap();

            // On success
            setNotification({ message: 'Login successful!', type: 'success' });
            navigate('/home');
        } catch (error) {
            console.error(error);

            if (error.message === 'Please verify your email first.') {
                // Store email in local storage and redirect to verification page
                localStorage.setItem('email', formData.email);
                setNotification({
                    message: 'Please verify your email. Redirecting...',
                    type: 'warning',
                });
                setTimeout(() => navigate('/verifyemail'), 2000);
            } else {
                // Generic error message
                setNotification({
                    message: error.message || 'Login failed. Please try again.',
                    type: 'danger',
                });
            }
        }
    };

    return (
        <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
            <h3 className="mb-4">Login</h3>

            {/* Notification Banner */}
            {notification.message && (
                <Alert
                    variant={notification.type}
                    onClose={() => setNotification({ message: '', type: '' })}
                    dismissible
                >
                    {notification.message}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                {/* Email Field */}
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* Submit Button */}
                <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />{' '}
                            Logging in...
                        </>
                    ) : (
                        'Login'
                    )}
                </Button>
            </Form>

            {/* Links Section */}
            <div className="mt-3 text-center">
                <p>
                    <Link to="/forget-password">Forgot Password?</Link>
                </p>
                <p>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </Container>
    );
};

export default LoginPage;

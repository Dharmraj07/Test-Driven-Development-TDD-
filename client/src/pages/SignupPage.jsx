import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signup } from '../features/authSlice';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [notification, setNotification] = useState({ message: '', type: '' });
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Dispatch the signup action and await its resolution if async
            await dispatch(signup(formData)).unwrap();

            // If successful, show a success notification
            setNotification({ message: 'Signup successful!', type: 'success' });
              // Store email in local storage
              localStorage.setItem("email", formData.email);
              setTimeout(() => {
                  navigate("/verifyemail");

                  
              }, 2000);
        } catch (error) {
            console.log(error.message);
           
            // If failed, show an error notification
            setNotification({ message: error.message || 'Signup failed!', type: 'danger' });
        }
    };

    return (
        <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
            <h3 className="mb-4">Signup</h3>

            {/* Notification */}
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
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Signup
                </Button>
            </Form>

            {/* Sign in link */}
            <div className="mt-3 text-center">
                <p>
                    Already have an account?{' '}
                    <Link to="/">Sign in</Link>
                </p>
            </div>
        </Container>
    );
};

export default SignupPage;

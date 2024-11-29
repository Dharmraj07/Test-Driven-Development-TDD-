import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgetPassword, resendOtp, resetPassword } from '../features/authSlice';
import { Form, Button, Alert, Container, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State variables
    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resendLoading, setResendLoading] = useState(false);

    // Handle OTP request submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Dispatch the forgetPassword action
            await dispatch(forgetPassword({ email })).unwrap();

            // Notify the user and show the modal
            setNotification({
                message: 'An OTP has been sent to your email address. Please check your inbox.',
                type: 'success',
            });
            setShowModal(true);
        } catch (error) {
            // Notify the user of any errors
            setNotification({
                message: error.message || 'Failed to send OTP. Please try again later.',
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP resend
    const handleResendOtp = async () => {
        setResendLoading(true);

        try {
            // Dispatch the resendOtp action
            await dispatch(resendOtp({ email })).unwrap();

            // Notify the user that the OTP has been resent
            setNotification({
                message: 'A new OTP has been sent to your email address.',
                type: 'success',
            });
        } catch (error) {
            setNotification({
                message: error.message || 'Failed to resend OTP. Please try again later.',
                type: 'danger',
            });
        } finally {
            setResendLoading(false);
        }
    };

    // Handle password reset submission
    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setNotification({ message: 'Passwords do not match!', type: 'danger' });
            return;
        }

        try {
            // Dispatch the resetPassword action
            await dispatch(resetPassword({ email, otp, newPassword })).unwrap();

            setNotification({
                message: 'Your password has been successfully reset. You can now log in.',
                type: 'success',
            });

            setShowModal(false);
            setTimeout(() => {
                navigate('/');
                
            }, 2000);
            
        } catch (error) {
            setNotification({
                message: error.message || 'Failed to reset password. Please try again later.',
                type: 'danger',
            });
        }
    };

    return (
        <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
            <h3 className="mb-4">Forgot Password</h3>

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
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                </Button>
            </Form>

            {/* Back to Login */}
            <div className="mt-3 text-center">
                <p>
                    Remember your password?{' '}
                    <a href="/">Back to Login</a>
                </p>
            </div>

            {/* OTP Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handlePasswordReset}>
                        <Form.Group className="mb-3" controlId="formOtp">
                            <Form.Label>OTP</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formNewPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button
                            variant="success"
                            type="submit"
                            className="w-100 mb-3"
                        >
                            Reset Password
                        </Button>
                    </Form>
                    <Button
                        variant="link"
                        onClick={handleResendOtp}
                        disabled={resendLoading}
                        className="w-100 text-center"
                    >
                        {resendLoading ? 'Resending...' : 'Resend OTP'}
                    </Button>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ForgotPasswordPage;

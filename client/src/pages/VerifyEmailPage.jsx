import React, { useState } from 'react';
import { resendOtp, verifyEmail } from '../features/authSlice';
import { useDispatch } from 'react-redux';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const VerifyEmailPage = () => {
    const [otp, setOtp] = useState(''); // State for OTP input
    const [alert, setAlert] = useState({ message: '', type: '' }); // State for alert messages
    const [resendStatus, setResendStatus] = useState(false); // State to manage OTP resend status
    const email = localStorage.getItem('email'); // Retrieve email from localStorage
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle OTP input change
    const handleOtpChange = (event) => {
        setOtp(event.target.value);
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate OTP input
        if (!otp || otp.length !== 6) {
            setAlert({ message: 'Please enter a valid 6-digit OTP.', type: 'danger' });
            return;
        }

        try {
            // Dispatch verifyEmail action
            await dispatch(verifyEmail({ email, otp })).unwrap();

            // On success, show a success message and navigate to Home
            setAlert({ message: 'Email verified successfully! Redirecting to Home...', type: 'success' });
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            // Show error message on failure
            setAlert({ message: error.message || 'Verification failed. Please try again.', type: 'danger' });
        }
    };

    // Handle resend OTP
    const handleResendOtp = async () => {
        try {
            setResendStatus(false); // Reset status before request
            await dispatch(resendOtp({ email })).unwrap();
            setAlert({ message: 'OTP has been resent to your email.', type: 'success' });
        } catch (error) {
            setAlert({ message: error.message || 'Failed to resend OTP. Please try again.', type: 'danger' });
        } finally {
            setResendStatus(true); // Enable resend button after request
        }
    };

    return (
        <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
            <h3 className="mb-4 text-center">Verify Your Email</h3>

            {/* Alert Notification */}
            {alert.message && (
                <Alert
                    variant={alert.type}
                    onClose={() => setAlert({ message: '', type: '' })}
                    dismissible
                >
                    {alert.message}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                {/* Display email with instruction */}
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Sent an OTP to this email for verification</Form.Label>
                    <Form.Control type="email" value={email} readOnly />
                </Form.Group>

                {/* OTP Input */}
                <Form.Group className="mb-3" controlId="formOtp">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={handleOtpChange}
                        maxLength={6}
                        required
                    />
                </Form.Group>

                {/* Verify Email Button */}
                <Button variant="primary" type="submit" className="w-100 mb-3">
                    Verify Email
                </Button>
            </Form>

            {/* Resend OTP Button */}
            <Button
                variant="secondary"
                className="w-100"
                onClick={handleResendOtp}
                disabled={resendStatus}
            >
                Resend OTP
            </Button>
        </Container>
    );
};

export default VerifyEmailPage;

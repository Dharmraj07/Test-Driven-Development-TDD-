const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');


// Routes
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/verify-email', authController.verifyEmail);
router.post('/reset-password', authController.resetPassword);
router.post('/forget-password', authController.forgetPassword);
router.post('/request-otp', authController.requestOtp);

module.exports = router;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');
const User = require('../models/User');

// Constants
const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes

// Utility to generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Sign-Up
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const user = new User({
      email,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + OTP_EXPIRY_TIME,
      isVerified: false,
    });

    await user.save();
    await sendEmail(email, 'Verify Your Email', `Your verification OTP is: ${otp}`);
    res.status(201).json({ success: true, message: 'User registered. Verification email sent.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Sign-In
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email first.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// OTP for Email Verification
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.otp === otp && user.otpExpires > Date.now()) {
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      res.status(200).json({ success: true, message: 'Email verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Password Reset with OTP
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.otp === otp && user.otpExpires > Date.now()) {
      user.password = await bcrypt.hash(newPassword, 10);
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      res.status(200).json({ success: true, message: 'Password reset successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Forget Password
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + OTP_EXPIRY_TIME;
    await user.save();
    await sendEmail(email, 'Password Reset OTP', `Your OTP for password reset is: ${otp}`);
    res.status(200).json({ success: true, message: 'Password reset OTP sent to email' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Request OTP
exports.requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + OTP_EXPIRY_TIME;
    await user.save();
    await sendEmail(email, 'Your OTP Code', `Your OTP is ${otp}`);
    res.status(200).json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

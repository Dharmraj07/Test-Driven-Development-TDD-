const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String }, // Optional and not unique
  profilePicture: { type: String, default: null }, // Store Cloudinary URL
  isProfileComplete: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
});

module.exports = mongoose.model('User', userSchema);

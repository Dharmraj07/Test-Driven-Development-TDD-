const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  getProfile,
  editProfile,
  uploadProfilePicture,
  removeProfilePicture,
} = require('../controllers/profileController');
const { storage } = require('../utils/cloudinary');

const upload = multer({ storage });
const router = express.Router();

// Get User Profile
router.get('/', authMiddleware, getProfile);

// Edit User Profile
router.put('/', authMiddleware, editProfile);

// Upload Profile Picture
router.post('/upload', authMiddleware, upload.single('profilePicture'), uploadProfilePicture);

// Remove Profile Picture
router.delete('/remove', authMiddleware, removeProfilePicture);

module.exports = router;

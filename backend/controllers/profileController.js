const User = require('../models/User');
const { cloudinary } = require('../utils/cloudinary');

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password'); // Exclude password from response
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Edit Profile (update username or other details)
exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (username) {
      user.username = username;
    }

    await user.save();
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Upload Profile Picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await cloudinary.uploader.upload(req.file.path);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.profilePicture = result.secure_url; // Save Cloudinary URL
    user.isProfileComplete = true;
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: 'Profile picture uploaded successfully',
        data: user,
      });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Remove Profile Picture
exports.removeProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.profilePicture) {
      // Optionally remove image from Cloudinary if necessary
      const publicId = user.profilePicture.split('/').pop().split('.')[0]; // Extract public ID
      await cloudinary.uploader.destroy(publicId);
    }

    user.profilePicture = null; // Clear the profile picture URL
    user.isProfileComplete = false; // Reset profile completeness
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture removed successfully',
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// const User = require("../models/User");
// const { cloudinary } = require("../utils/cloudinary");

// // Upload Profile Picture
// exports.uploadProfilePicture = async (req, res) => {
//   try {
//     const userId = req.user.id; // From middleware (decoded JWT)
//     const result = await cloudinary.uploader.upload(req.file.path);

//     const user = await User.findById(userId);
//     user.profilePicture = result.secure_url; // Save Cloudinary URL
//     user.isProfileComplete = true;
//     await user.save();

//     res
//       .status(200)
//       .json({
//         success: true,
//         message: "Profile updated successfully",
//         data: user,
//       });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

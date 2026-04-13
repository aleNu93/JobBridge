const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name lastname1 lastname2 email phone role company skills profilePicture createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const profilePicture = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture },
      { new: true }
    ).select('-passwordHash');

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'lastname1', 'lastname2', 'cedula',
      'phone', 'birthDate', 'company', 'skills', 'profilePicture'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }

};

module.exports = { getProfile, updateProfile, uploadProfilePicture, getPublicProfile };
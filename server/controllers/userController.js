// controllers/userController.js
const User = require("../models/User");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("roles department");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get team members for managers
exports.getTeamMembers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("department");

    // Assuming 'department' is a way to identify team members
    const teamMembers = await User.find({ department: user.department._id });

    res.json(teamMembers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get own profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("roles department");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

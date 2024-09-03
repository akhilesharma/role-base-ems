// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10; // Number of rounds for salt generation

// User registration
exports.register = async (req, res) => {
  const { username, password, roles, department } = req.body;

  try {
    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      password: hashedPassword, // Save the hashed password
      roles,
      department,
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// User login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid Username" });

    // Compare the plain text password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, roles: user.roles },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get logged in user
exports.getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password") // Exclude password from the response
      .populate("roles department");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

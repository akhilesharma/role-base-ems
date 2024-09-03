// routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["VIEW_ALL_USERS"], 1), // Only Super Admin (hierarchyLevel 1) can view all users
  userController.getAllUsers
);

router.get(
  "/team",
  authMiddleware,
  roleMiddleware(["VIEW_TEAM_USERS"], 3), // Manager or higher can view their team members
  userController.getTeamMembers
);

router.get(
  "/profile",
  authMiddleware,
  roleMiddleware(["VIEW_OWN_PROFILE"], 5), // Everyone can view their own profile
  userController.getProfile
);

module.exports = router;

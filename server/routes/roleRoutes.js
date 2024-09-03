// routes/roleRoutes.js
const express = require("express");
const roleController = require("../controllers/roleController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Only users with certain permissions can manage roles
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["MANAGE_ROLES"], 1), // Example: Super Admin (hierarchyLevel 1) or higher
  roleController.createRole
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["VIEW_ROLES"], 5), // Example: All users can view roles
  roleController.getAllRoles
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["VIEW_ROLES"], 5), // Example: All users can view roles
  roleController.getRoleById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["MANAGE_ROLES"], 1), // Example: Super Admin or higher can update roles
  roleController.updateRole
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["MANAGE_ROLES"], 1), // Example: Super Admin or higher can delete roles
  roleController.deleteRole
);

module.exports = router;

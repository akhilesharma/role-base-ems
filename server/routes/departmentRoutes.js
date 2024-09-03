// routes/departmentRoutes.js
const express = require("express");
const departmentController = require("../controllers/departmentController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Only users with a certain hierarchy level or permissions can manage departments
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["MANAGE_DEPARTMENTS"], 2), // Example: Admins (hierarchyLevel 2) or higher
  departmentController.createDepartment
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["VIEW_DEPARTMENTS"], 5), // Example: All users can view departments
  departmentController.getAllDepartments
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["VIEW_DEPARTMENTS"], 5), // Example: All users can view departments
  departmentController.getDepartmentById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["MANAGE_DEPARTMENTS"], 2), // Example: Admins or higher can update
  departmentController.updateDepartment
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["MANAGE_DEPARTMENTS"], 2), // Example: Admins or higher can delete
  departmentController.deleteDepartment
);

module.exports = router;

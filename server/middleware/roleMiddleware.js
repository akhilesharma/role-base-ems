// middleware/roleMiddleware.js
const Role = require("../models/Role");

const roleMiddleware = (requiredPermissions, maxHierarchyLevel = Infinity) => {
  return async (req, res, next) => {
    try {
      const userRoles = req.user.roles;

      // Fetch user's roles with hierarchy levels and permissions
      const roles = await Role.find({ _id: { $in: userRoles } }).populate(
        "permissions"
      );

      // Check user's highest hierarchy level
      const userHierarchyLevels = roles.map((role) => role.hierarchyLevel);
      const highestUserLevel = Math.min(...userHierarchyLevels);

      // Ensure user level is within the allowed hierarchy level
      if (highestUserLevel > maxHierarchyLevel) {
        return res
          .status(403)
          .json({ message: "You do not have the required hierarchy level." });
      }

      // Flatten permissions array
      const userPermissions = roles.flatMap((role) =>
        role.permissions.map((p) => p.name)
      );

      // Check if user has at least one of the required permissions
      const hasPermission = requiredPermissions.some((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res
          .status(403)
          .json({ message: "You do not have the required permissions." });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = roleMiddleware;

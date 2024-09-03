// controllers/roleController.js
const Role = require("../models/Role");
const Permission = require("../models/Permission");

// Create a new role
exports.createRole = async (req, res) => {
  const { name, hierarchyLevel, permissions } = req.body;

  try {
    const role = new Role({ name, hierarchyLevel, permissions });
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions");
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate("permissions");
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a role
exports.updateRole = async (req, res) => {
  const { name, hierarchyLevel, permissions } = req.body;

  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    role.name = name || role.name;
    role.hierarchyLevel = hierarchyLevel || role.hierarchyLevel;
    role.permissions = permissions || role.permissions;

    await role.save();
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a role
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    await role.remove();
    res.json({ message: "Role deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

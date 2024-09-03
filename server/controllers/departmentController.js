// controllers/departmentController.js
const Department = require("../models/Department");

// Create a new department
exports.createDepartment = async (req, res) => {
  const { name, description } = req.body;

  try {
    const department = new Department({ name, description });
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a department
exports.updateDepartment = async (req, res) => {
  const { name, description } = req.body;

  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    department.name = name || department.name;
    department.description = description || department.description;

    await department.save();
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a department
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    await department.remove();
    res.json({ message: "Department deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

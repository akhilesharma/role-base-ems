// seed.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Role = require("./models/Role");
const Permission = require("./models/Permission");
const Department = require("./models/Department");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

exports.seedData = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Clear existing data
    await Role.deleteMany({});
    await Permission.deleteMany({});
    await Department.deleteMany({});
    await User.deleteMany({});

    console.log("Existing data cleared");

    // Create permissions
    const permissions = [
      {
        name: "MANAGE_USERS",
        description: "Allows managing users in the system.",
      },
      { name: "VIEW_USERS", description: "Allows viewing user details." },
      {
        name: "MANAGE_DEPARTMENTS",
        description: "Allows managing departments.",
      },
      { name: "VIEW_DEPARTMENTS", description: "Allows viewing departments." },
      {
        name: "MANAGE_ROLES",
        description: "Allows managing roles and permissions.",
      },
      { name: "VIEW_ROLES", description: "Allows viewing role details." },
    ];

    const createdPermissions = await Permission.insertMany(permissions);
    console.log("Permissions created");

    // Create roles
    const roles = [
      {
        name: "Super Admin",
        hierarchyLevel: 1,
        permissions: createdPermissions.map((p) => p._id), // All permissions
      },
      {
        name: "Admin",
        hierarchyLevel: 2,
        permissions: createdPermissions
          .filter((p) => p.name !== "MANAGE_ROLES")
          .map((p) => p._id), // All except 'MANAGE_ROLES'
      },
      {
        name: "Manager",
        hierarchyLevel: 3,
        permissions: createdPermissions
          .filter((p) => p.name.includes("VIEW"))
          .map((p) => p._id), // Only view permissions
      },
      {
        name: "Employee",
        hierarchyLevel: 4,
        permissions: [], // No permissions by default
      },
    ];

    const createdRoles = await Role.insertMany(roles);
    console.log("Roles created");

    // Create departments
    const departments = [
      {
        name: "Human Resources",
        description: "Handles employee-related services.",
      },
      {
        name: "Engineering",
        description: "Develops and maintains software products.",
      },
      {
        name: "Marketing",
        description: "Manages marketing and advertising activities.",
      },
    ];

    await Department.insertMany(departments);
    console.log("Departments created");

    // Create a default Super Admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const superAdminRole = createdRoles.find(
      (role) => role.name === "Super Admin"
    );

    const superAdminUser = new User({
      username: "superadmin",
      password: hashedPassword,
      roles: [superAdminRole._id],
      department: null, // Super Admin is not tied to a department
    });

    await superAdminUser.save();
    console.log("Super Admin user created");

    console.log("Data seeding completed successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

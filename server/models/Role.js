// models/Role.js
const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  hierarchyLevel: { type: Number, required: true }, // Lower numbers have higher authority
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
});

module.exports = mongoose.model("Role", RoleSchema);

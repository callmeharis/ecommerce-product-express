const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required field"],
    minLength: [3, "First name cannot be less than 3 characters"],
    maxLength: [15, "First name cannot exceed 15 characters"],
  },
  lastName: {
    type: String,
    required: [true, "First name is required field"],
    minLength: [3, "Last name cannot be less than 3 characters"],
    maxLength: [15, "Last name cannot exceed 15 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required field"],
    minLength: [3, "Email cannot be less than 3 characters"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Username is required field"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required field"],
    minLength: [8, "Password cannot be less than 8 characters"],
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordTokenExpiry: {
    type: Date,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

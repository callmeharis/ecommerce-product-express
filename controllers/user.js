const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send("Email already in user, please use another email");
    }
    const register = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: hashedPassword,
    });
    const token = jwt.sign(
      {
        email: register.email,
        username: register.username,
        id: register._id,
      },
      process.env.JWT_SECRET
    );
    // res.send(register);
    res.status(201).json({
      register,
      token,
      msg: "User registered successfully",
    });
  } catch (error) {
    res.send(error);
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        msg: "user not found, please create account first",
      });
    }
    const isMatchedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isMatchedPassword) {
      return res.status(400).json({
        msg: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      msg: "user logged in successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
      error,
    });
  }
};

module.exports = { registerUser, loginUser };

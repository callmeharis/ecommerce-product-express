const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        msg: "Email already in use, please use another email",
      });
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
    res.status(500).json({
      msg: "Internal Server Error",
      error,
    });
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

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        msg: "user not found, please create account",
      });
    }
    const resetToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = Date.now() + 3600000;
    await user.save();

    await sendResetPasswordEmail(email, resetToken);
    res.status(200).json({
      msg: "Reset Password link has been sent to your email",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong",
      error,
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).json({
        msg: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;

    await user.save();

    const resetEmail = user.email;
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: resetEmail,
      subject: `Reset Password Success`,
      html: `Congratulations, your password has been updated successfully`,
    };
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    await transporter.sendMail(mailOptions);
    console.log("password reset token success");

    res.status(200).json({
      msg: "Your password has been reset successfully, please login with new password",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong",
      error,
    });
  }
};

const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    const resetLink = `${process.env.FRONTEND_REACT_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: `Reset Password Mail`,
      html: `<h1>Hello</h1>, if you want to reset your password, please click on the following link<br> <a href=${resetLink}>
        Link
      </a>`,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Reset password link has been sent to your email`);
  } catch (error) {
    console.log(`Error in email sending ${error}`);
  }
};

module.exports = { registerUser, loginUser, forgetPassword, resetPassword };

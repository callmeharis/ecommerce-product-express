const express = require("express");
const {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
} = require("../controllers/user");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/auth/forget-password", forgetPassword);
router.post("/auth/reset-password/:token", resetPassword);

module.exports = router;

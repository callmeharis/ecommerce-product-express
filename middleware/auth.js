const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new Error("Authentication Invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("payload", payload);
    req.user = { userId: payload.id };
    console.log("req.user", req.user);
    console.log(payload.id);
    next();
  } catch (error) {
    throw new Error("Authentication Invalid");
  }
};

module.exports = auth;

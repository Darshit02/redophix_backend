const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Make sure path is correct
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. No token provided.",
    });
  }

  try {
    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid token.",
    });
  }
};

module.exports = authMiddleware;

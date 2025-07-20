const User = require("../models/user");
const { logger } = require("../utils/logger");
const { validateEmailChange } = require("../utils/validation");

const changeEmail = async (req, res) => {
  logger.info("Email change endpoint hit...");

  try {
    const { error } = validateEmailChange(req.body);
    if (error) {
      const msg = error.details[0]?.message || "Invalid data";
      logger.warn("Validation error: " + msg);
      return res.status(400).json({
        success: false,
        message: msg,
      });
    }

    
    const userId = await req.user._id; // Assuming user ID is stored in req.user
    const user = await User.findById(userId);
      if (!user) {
      logger.warn(`User not found for ID: ${userId}`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!req.user || !req.user._id) {
      logger.error("Unauthorized access attempt");
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { newEmail } = req.body;
  

    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      logger.warn(`Email already in use: ${newEmail}`);
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    user.email = newEmail;
    await user.save();

    logger.info(`Email changed successfully for user: ${userId}`);
    return res.status(200).json({
      success: true,
      message: "Email changed successfully",
    });
  } catch (e) {
    logger.error("Email change error occurred", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  changeEmail,
};

const User = require("../models/user");
const { logger } = require("../utils/logger");
const { validateEmailChange } = require("../utils/validation");
const passwordResetTemplate = require("../template/email");
const sendEmail = require("../services/mail-service");
const argon2 = require("argon2");
const crypto = require("crypto");

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

const sendEmailForResetPassword = async (req, res) => {
  logger.info("Password reset email endpoint hit...");

  const email = req.body?.email;

  if (!email) {
    logger.warn("Email is required for password reset");
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn(`No user found with email: ${email}`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.email || typeof user.email !== "string") {
      logger.error("User email is missing or invalid");
      return res.status(500).json({
        success: false,
        message: "Internal Server Error. Invalid user email.",
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const emailContent = passwordResetTemplate(user.username, resetUrl);

    console.log("Sending reset email to:", user.email);
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: emailContent,
    });

    logger.info(`Password reset email sent to ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    logger.error("Error sending password reset email:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



const resetPasswordConfirm = async (req, res) => {
  logger.info("Password reset confirmation received");

  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    logger.warn("Reset token is required");
    return res.status(400).json({
      success: false,
      message: "Reset token is required",
    });
  }

  if (!password) {
    logger.warn("New password is required");
    return res.status(400).json({
      success: false,
      message: "New password is required",
    });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      logger.warn("Invalid or expired token");
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Hash new password using argon2
    const hashedPassword = await argon2.hash(password);
    user.password = hashedPassword;

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    logger.info(`Password reset successful for ${user.email}`);
    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    logger.error("Error resetting password:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  changeEmail,
  sendEmailForResetPassword,
  resetPasswordConfirm
};

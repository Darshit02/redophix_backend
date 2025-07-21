const express = require("express");
const { changeEmail, sendEmailForResetPassword, resetPasswordConfirm } = require("../controllers/settings");
const authMiddleware = require("../middleware/auth-middleware");

const router = express.Router();

router.patch("/email-change", authMiddleware, changeEmail);
router.post("/reset-password-email-send",sendEmailForResetPassword );
router.post("/reset-password/:token", resetPasswordConfirm);

module.exports = router;

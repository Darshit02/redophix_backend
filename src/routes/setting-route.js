const express = require("express");
const { changeEmail } = require("../controllers/settings");
const authMiddleware = require("../middleware/auth-middleware");

const router = express.Router();

router.patch("/email-change", authMiddleware, changeEmail);

module.exports = router;

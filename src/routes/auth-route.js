const express = require("express");
const { resgiterUser, loginUser, logoutUser, refreshTokenUser } = require("../controllers/auth");
const router = express.Router();

router.post("/register", resgiterUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshTokenUser);

module.exports = router;
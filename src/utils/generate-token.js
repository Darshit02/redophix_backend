const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const RefreshToken = require("../models/refress-token");

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "60m" }
  );

  const refreshToken = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // refresh token expires in 7 days

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    email: user.email,
    username: user.username,
    expiresAt,
  });

  return { accessToken, refreshToken };
};

module.exports = generateTokens;
const multer = require("multer");

const storage = multer.memoryStorage(); // Use memory, not disk
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

module.exports = upload;

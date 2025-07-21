const express = require("express");
const router = express.Router();
const { addTag, getTags, deleteTag } = require("../controllers/tags");
const authMiddleware = require("../middleware/auth-middleware");

router.post("/addTag", authMiddleware, addTag);
router.get("/getTag", authMiddleware, getTags);
router.delete("/deleteTag", authMiddleware, deleteTag);

module.exports = router;
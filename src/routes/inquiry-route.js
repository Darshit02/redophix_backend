const express = require("express");
const router = express.Router();
const { CreateInquiry, getAllSubmissions, deleteSubmission } = require("../controllers/inquiry");

router.post("/inquiry",CreateInquiry)
router.get("/get-inquiry", getAllSubmissions);
router.delete("/delete-inquiry/:id", deleteSubmission);

module.exports = router;
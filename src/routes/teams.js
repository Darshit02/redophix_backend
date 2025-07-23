const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const { createTeam, getAllTeams, updateTeam, deleteTeam } = require("../controllers/teams");
const router = express.Router();

router.post("/create-team", authMiddleware, createTeam);
router.get("/get-all-mamber", getAllTeams);
router.put("/update-mamber/:id", updateTeam );
router.delete("/delete-mamber/:id", deleteTeam);

module.exports = router;

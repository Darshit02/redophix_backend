const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/auth-middleware");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projects");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// handle previewImage (1) + demoImages (many)
const multipleUpload = upload.fields([
  { name: "previewImage", maxCount: 1 },
  { name: "demoImages", maxCount: 10 },
]);

router.post("/createprojects", multipleUpload, authMiddleware, createProject);
router.get("/get-all", authMiddleware, getProjects);
router.get("/get-single/:id", authMiddleware, getProjectById);
router.put("/update-project/:id",authMiddleware, updateProject);
router.delete("/delete/:id" , authMiddleware,deleteProject)


module.exports = router;

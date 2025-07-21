const Project = require("../models/projects");
const { logger } = require("../utils/logger");

const createProject = async (req, res) => {
  logger.info("Project create endpoint hit");

  try {
    const { name, description, caseStudy, liveLink } = req.body;

    // Parse JSON stringified fields
    let tags = [];
    let developer = {};

    try {
      tags = JSON.parse(req.body.tags);
    } catch {
      logger.warn("Invalid or missing tags format");
    }

    try {
      developer = req.body.developer ? JSON.parse(req.body.developer) : {};
    } catch {
      logger.warn("Invalid developer JSON");
    }

    // Validate required fields
    if (!name || !Array.isArray(tags) || tags.length === 0) {
      logger.warn("Validation failed: Missing name or tags");
      return res.status(400).json({
        success: false,
        message: "Name and at least one tag are required",
      });
    }

    // Convert previewImage to base64
    let previewImageBase64 = null;
    if (req.files?.previewImage?.[0]) {
      const file = req.files.previewImage[0];
      previewImageBase64 = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;
    }

    // Convert demoImages[] to base64 array
    let demoImageBase64s = [];
    if (req.files?.demoImages?.length > 0) {
      demoImageBase64s = req.files.demoImages.map((file) => {
        return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      });
    }

    const newProject = new Project({
      name,
      tags,
      description,
      caseStudy,
      previewImage: previewImageBase64,
      liveLink,
      developer,
      demoImages: demoImageBase64s,
    });

    await newProject.save();

    logger.info(`Project created: ${newProject._id}`);
    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    logger.error("Project creation failed: " + error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getProjects = async (req, res) => {
  logger.info("Fetching all projects");
  try {
    const projects = await Project.find().populate("tags");
    res.status(200).json({
      success: true,
      message: "Project fetched success",
      data: projects,
    });
  } catch (error) {
    logger.error("Failed to fetch projects", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getProjectById = async (req, res) => {
  logger.info(`Fetching project with ID: ${req.params.id}`);
  try {
    const project = await Project.findById(req.params.id).populate("tags");
    if (!project) {
      logger.warn("Project not found: " + req.params.id);
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({
      success: true,
      message: "Project found sucessfully",
      data: project,
    });
  } catch (error) {
    logger.error("Failed to fetch project", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const updateProject = async (req, res) => {
  logger.info(`Updating project with ID: ${req.params.id}`);
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      logger.warn("Update failed: Project not found " + req.params.id);
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    logger.error("Project update failed", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteProject = async (req, res) => {
  logger.info(`Deleting project with ID: ${req.params.id}`);
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
      logger.warn("Delete failed: Project not found " + req.params.id);
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    logger.error("Project deletion failed", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
deleteProject
};

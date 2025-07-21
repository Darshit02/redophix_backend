const { model } = require("mongoose");
const Tag = require("../models/tags");
const { logger } = require("../utils/logger");

const addTag = async (req, res) => {
  logger.info("Adding a new tag");
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Tag name is required" });
  }
  try {
    const tag = new Tag({ name });
    await tag.save();
    res.status(201).json({
      success: true,
      message: "Tag added successfully",
      tag,
    });
  } catch (error) {
    logger.error("Error adding tag:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const getTags = async (req, res) => {
  logger.info("Fetching all tags");
  try {
    const tags = await Tag.find({}).sort({ name: 1 });
    if (!tags) {
      return res.status(404).json({
        success: false,
        error: "No tags found",
      });
    }
    res.status(200).json({
      success: true,
      tags,
    });
  } catch (error) {
    logger.error("Error fetching tags:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const deleteTag = async (req, res) => {
    logger.info("Deleting a tag");
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({
            success: false,
            error: "Tag ID is required"
        });
    }
    try {
        const tag = await Tag.findByIdAndDelete(id);
        if (!tag) {
            return res.status(404).json({
                success: false,
                error: "Tag not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Tag deleted successfully"
        });
    } catch (error) {
        logger.error("Error deleting tag:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
}

module.exports = {
  addTag,
  getTags,
  deleteTag
};

const Teams = require("../models/teams");
const { logger } = require("../utils/logger");

const createTeam = async (req, res) => {
  logger.info("Mamber create end point...");
  const { name, description, mobile, email, designation, imgUrl } = req.body;
  if (!name || !description || !mobile || !email || !designation || !imgUrl) {
    logger.warn("Missing required team fields in request body", {
      body: req.body,
    });

    return res.status(400).json({
      success: false,
      message:
        "All fields (name, description, mobile, email, designation, imgUrl) are required",
    });
  }

  try {
    const newTeam = new Teams({
      name,
      description,
      mobile,
      email,
      designation,
      imgUrl,
    });
    await newTeam.save();

    logger.info("New team member created", { id: newTeam._id, name });

    return res.status(201).json({
      success: true,
      message: "Team member created successfully",
      data: newTeam,
    });
  } catch (err) {
    logger.warn("Failed to create team member", { error: err.message });
    return res.status(500).json({
      success: false,
      message: "Server error while creating team member",
    });
  }
};

const updateTeam = async (req, res) => {
  logger.info("Update teams Endpoint hit...");
  const { id } = req.params;
  const { name, description, mobile, email, designation, imgUrl } =
    req.body || {};

  if (!name || !description || !mobile || !email || !designation || !imgUrl) {
    logger.warn("Missing fields in team update", { id, body: req.body });

    return res.status(400).json({
      success: false,
      message: "All fields are required for update",
    });
  }

  try {
    const updated = await Teams.findByIdAndUpdate(
      id,
      { name, description, mobile, email, designation, imgUrl },
      { new: true, runValidators: true }
    );

    if (!updated) {
      logger.warn("Team member not found for update", { id });

      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    logger.info("Team member updated", { id });

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      data: updated,
    });
  } catch (err) {
    logger.warn("Error updating team member", { error: err.message });

    res.status(500).json({
      success: false,
      message: "Server error while updating team member",
    });
  }
};

const deleteTeam = async (req, res) => {
  logger.info("delete team mamber endpoint hit...");
  const { id } = req.params;

  try {
    const deleted = await Teams.findByIdAndDelete(id);

    if (!deleted) {
      logger.warn("Team member not found for deletion", { id });

      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    logger.info("Team member deleted", { id });

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (err) {
    logger.warn("Error deleting team member", { error: err.message });

    res.status(500).json({
      success: false,
      message: "Server error while deleting team member",
    });
  }
};

const getAllTeams = async (req, res) => {
    logger.info("getting all team mambers...")
  try {
    const teams = await Teams.find().sort({ createdAt: -1 });

    logger.info("Fetched all team members", { count: teams.length });

    res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (err) {
    logger.warn("Failed to fetch team members", { error: err.message });

    res.status(500).json({
      success: false,
      message: "Server error while fetching team members",
    });
  }
};

module.exports = {
  createTeam,
  updateTeam,
  deleteTeam,
  getAllTeams
};

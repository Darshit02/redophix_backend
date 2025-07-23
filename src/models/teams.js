const mongoose = require("mongoose");

const teamsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    designation: { type: String, required: true },
    imgUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Teams = mongoose.model("Teams", teamsSchema);
module.exports = Teams;

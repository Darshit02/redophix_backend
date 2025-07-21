const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    description: {
      type: String,
    },
    caseStudy: {
      type: String,
    },
    previewImage: {
      type: String, // base64 string
    },
    liveLink: {
      type: String,
    },
    developer: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    demoImages: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

ProjectSchema.index({ name: "text", description: "text", caseStudy: "text" });

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;

const mongoose = require("mongoose")

const InquirySchem = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry",InquirySchem)
module.exports = Inquiry
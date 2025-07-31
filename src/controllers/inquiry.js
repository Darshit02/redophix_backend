const Inquiry = require("../models/inquiry");
const sendEmail = require("../services/mail-service");
const { logger } = require("../utils/logger");

const CreateInquiry = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      logger.warn("CreateInquiry: Missing required fields", {
        name,
        email,
        subject,
      });
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const inquiry = await Inquiry.create({ name, email, subject, message });
    logger.info("CreateInquiry: Inquiry saved to DB", {
      id: inquiry._id,
      name,
      email,
    });

    // Send email to team
    const teamEmailHtml = `
      <h2>New Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject || "No Subject"}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await sendEmail({
      to: "yourteam@example.com",
      subject: `New Contact Form Submission from ${name}`,
      html: teamEmailHtml,
    });

    logger.info("CreateInquiry: Team email sent", {
      to: "yourteam@example.com",
    });

    // Send confirmation to client
    await sendEmail({
      to: email,
      subject: "Thank you for contacting us",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out! We have received your message and will connect with you as soon as possible.</p>
        <p>Best regards,<br/>Your Company Name</p>
      `,
    });

    logger.info("CreateInquiry: Confirmation email sent to client", {
      to: email,
    });

    return res.status(200).json({
      success: true,
      message: "Submission successful. Confirmation email sent.",
    });
  } catch (error) {
    logger.error("CreateInquiry: Error during form submission", {
      error: error.message,
    });
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Inquiry.find().sort({ createdAt: -1 });
    logger.info("getAllSubmissions: Retrieved submissions", {
      count: submissions.length,
    });
    return res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    logger.error("getAllSubmissions: Failed to fetch submissions", {
      error: error.message,
    });
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteSubmission = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Inquiry.findByIdAndDelete(id);
    if (!result) {
      logger.warn("deleteSubmission: Submission not found", { id });
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }

    logger.info("deleteSubmission: Submission deleted", { id });
    return res
      .status(200)
      .json({ success: true, message: "Submission deleted" });
  } catch (error) {
    logger.error("deleteSubmission: Failed to delete submission", {
      id,
      error: error.message,
    });
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  CreateInquiry,
  deleteSubmission,
  getAllSubmissions,
};

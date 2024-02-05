require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.SERVER_PORT || 8001;

app.use(bodyParser.json());

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE, // e.g., 'gmail'
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// API to send welcome email
app.post("/sendWelcomeEmail", (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Welcome email sent: " + info.response);
  });
});

// API to send report email
app.post("/sendReportEmail", (req, res) => {
  const { to, subject, html } = req.body;

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Report email sent: " + info.response);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

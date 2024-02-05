const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["client", "therapist"],
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  clientDetails: {
    DOB: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
  },
  therapistDetails: {
    specialization: String,
    experienceYears: Number,
  },
  isConfigured: {
    type: Boolean,
    required: true,
    default: false,
  },
  reports: [{ type: mongoose.Schema.ObjectId, ref: "Report" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
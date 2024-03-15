const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatGroupSchema = new Schema({
  // User information
  name: {
    type: String,
    required: true,
    default: String(Date.now()),
  },
  chatIds: [{ type: String, ref: "ChatHist" }],
  userId: {
    type: String,
    ref: "User",
    required: true,
    index: true,
  },
});

module.exports = mongoose.model("ChatGroups", chatGroupSchema);

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatGroupSchema = new Schema({
  // User information
  name: {
    type: String,
    required: true,
    default: String(Date.now()),
  },
  chatIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChatHist" }],
  userId: {
    type:String,
    required: true,
    index: true,
  },
});

module.exports = mongoose.model("ChatGroups", chatGroupSchema);

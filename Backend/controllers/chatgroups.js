const chatGroupSchema = require("../models/ChatGroups");
const ChatHist = require("../models/ChatHist");
const userModel = require('../models/User');

const getChatGroups = async (req, res) => {
  const { userId } = req;
  if (!userId || !userId.trim().length) {
    res.status(422).send("UserId is required");
  }
  try {
    const getAllchatGroups = await chatGroupSchema.find({ userId: userId });
    return getAllchatGroups;
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message || "Something Went Wrong");
  }
};

const createAllGroups = async (req, res) => {
    try {
        const userData = await userModel.find();
        console.log(userData);
        const allData = await ChatHist.find();
        return res.json(allData);
    } catch (error) {
        console.log(error);
        res.status(500).send("Something Went Wrong")
    }
};

const createsingleChatGroup = async (req,res) => {
  const { body:{ name }, userId } = req;
  if(!name || !name.trim().length){
    return res.status(422).send("Name is required");
  }
  try {
   const createUser = (await chatGroupSchema.create({ userId, name })).save();
    return res.send("ChatGroup is created");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
}

module.exports = { getChatGroups, createAllGroups, createsingleChatGroup };

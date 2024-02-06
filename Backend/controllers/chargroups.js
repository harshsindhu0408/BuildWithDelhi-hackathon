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
        const allData = await ChatHist.find().populate('userId').exec((err, data) => {
          if(err){
            console.error(err);
            return;
          }
          console.log('All Data', data);
        });
        // const groupedBy = allData.reduce((x, y) => {
        //   (x[y.userId] = x[y.userId] || []).push(y);
        //   return x;
        // }, {});
        return res.json(allData);
    } catch (error) {
        console.log(error);
        res.status(500).send("Something Went Wrong")
    }
};

module.exports = { getChatGroups, createAllGroups };
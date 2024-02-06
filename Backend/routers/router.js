const { Router } = require("express");
const { connectWithChatBot } = require("../controllers/chat.js");
const { doAnalysis, getAnalysis } = require("../controllers/analysis.js");
const { userMiddleware } = require("../middlewares/genUserId.js");
const { signup, login, isUser, logout } = require("../controllers/user.js");
const { getChatGroups, createAllGroups, createsingleChatGroup } = require("../controllers/chatgroups.js");
const { getBelowAverageScoreData } = require("../controllers/scorecard.js");

const router = Router();
router.route("/cron").get((req, res) => {
  res.status(200).json({ message: "hello" });
});
router.route("/chat").get(userMiddleware, connectWithChatBot);
router.route("/analysis").get(userMiddleware, doAnalysis);
router.route("/fetchanalysis").get(userMiddleware, getAnalysis);
router.route('/getbelowscorer').get(userMiddleware, getBelowAverageScoreData);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/isUser").get(isUser);
router.route("/logout").get(logout);
router.route('/getchatgroups').get(getChatGroups);
router.route('/createallgroups').post(createAllGroups);
router.route('/createchatgroup').post(userMiddleware,createsingleChatGroup);

module.exports = router;

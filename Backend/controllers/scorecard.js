const reportSchema = require("../models/Report");

const getBelowAverageScoreData = async (req, res) => {
  try {
    const getAllData = await reportSchema
      .find({ score: { $lt: 5 } })
      .populate("userId")
      .exec();
    const resultdata = getAllData.map((l) => ({
      ...l,
      analysis: l.analysis?.slice(30),
    }));
    return res.send(resultdata);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something Went Wrong");
  }
};

module.exports = { getBelowAverageScoreData };

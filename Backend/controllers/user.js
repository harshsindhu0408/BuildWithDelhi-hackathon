const { genAnalysis } = require("./analysis");
const report = require("../models/Report");
const { v4: uuid } = require("uuid");
const UserModel = require("../models/User");
const { decodeAuthToken } = require("../firebase/auth");

async function signup(req, res) {
  try {
    const userId = req.userId;
    console.log(userId);
    const isUserPresent = await UserModel.findOne({ userId });
    if (isUserPresent && isUserPresent.isConfigured) {
      return res.status(409).send("User Already Present");
    }
    const {
      email: useremail,
      name,
      phoneno,
      city,
      zip,
      role,
      state,
      dob,
      gender,
      specialization,
      experienceYears,
    } = req.body;
    const token = req.headers.token;
    // console.log(req.headers.token+ "here");
    if (
      !useremail ||
      !phoneno ||
      !city ||
      !zip ||
      !state ||
      !dob ||
      !gender ||
      !name
    ) {
      return res.status(422).send("User Details are required");
    }
    if (!role || (role != "client" && role != "therapist")) {
      return res.status(422).send("Role is not present");
    }
    if (role === "therapist" && (!specialization || !experienceYears)) {
      return res.status(422).send("Therapist details required");
    }
    const user = await UserModel.create({
      userId,
      email: useremail,
      role,
      fullName: name,
      phoneNumber: phoneno,
      address: {
        street: "",
        city,
        state,
        zipCode: zip,
      },
      clientDetails: {
        DOB: dob,
        gender,
      },
      therapistDetails: {
        specialization,
        experienceYears,
      },
      isConfigured: true,
    });
    await user.save();
    return res.status(200).send("Account Created");
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid Access Token" });
  }
}

async function login(req, res) {
  try {
    // const auth = new FirebaseAuth();
    const email = await decodeAuthToken(req.headers.token);
    if (!email) {
      res.status(401).json({ message: "Invalid Access Token" });
      return;
    }
    //get Data from email from database
    const data = await UserModel.findOne({ email: email });

    if (data?.id) {
      res.cookie("userid", data.id, {
        maxAge: 1209600000, //14 * 24 * 60 * 60 * 1000 -> 14days
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    res.status(200).json({ data: data });
  } catch (error) {
    res.status(401).json({ message: "Invalid Access Token" });
  }
}

async function isUser(req, res) {
  try {
    console.log(req.cookies?.uid);
    if (req.cookies?.uid) {
      const userid = req.cookies?.uid;
      console.log(userid);
      const user = await UserModel.find({ userId: userid });
      // console.log(user, "Here");
      if (user?.length != 0) {
        res.status(200).json({ message: "User validated" });
      } else {
        res.status(404).json({ error: "user not found" });
      }
    } else {
      res.status(401).json({ error: "Logged Out" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ error: "Logged Out" });
  }
}

async function logout(req, res) {
  if (!req.cookies?.uid) {
    res.status(401).json({ Error: "UserId not found" });
    return;
  }
  res.cookie("userid", null, {
    maxAge: 0,
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ msg: "loggedout" });
}

module.exports = { signup, login, isUser, logout };

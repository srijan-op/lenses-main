const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateToken } = require("../config/generateToken");

const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already Exist");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to Create new user");
  }
});

const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email and Password");
  }
});

const allUsers = expressAsyncHandler(async (req, res) => {
  const key = req.query.search
    ? {
        $or: [
          { name: new RegExp(req.query.search, "i") },
          { email: new RegExp(req.query.search, "i") },
        ],
      }
    : {};

  const users = await User.find(key).find({ _id: { $ne: req.user._id } });
  res.send(users);
  console.log(key);
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
};

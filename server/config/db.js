const mongoose = require("mongoose");

const connect = async () => {
  try {
    const con = await mongoose.connect(process.env.MongoDB_URI);
    console.log("mongoDB connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

module.exports = { connect };

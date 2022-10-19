const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const options = {};
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;

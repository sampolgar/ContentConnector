const { MongoClient } = require("mongodb");

let client;
let db;

const connectDB = async () => {
  client = new MongoClient(process.env.MONGO_URI, options);
  await client.connect();
  db = client.db(process.env.MONGO_DB);
  module.exports = { connectDB, client };
};

// const collection = db.collection("test");

//   let options = {};
//   client = new MongoClient(process.env.MONGO_URI, options);

//   try {
//     await client.connect();
//     db = client.db("test");

//     console.log("MongoDB Connected".cyan.underline.bold);
//   } catch (e) {
//     console.error(e);
//   }
// };

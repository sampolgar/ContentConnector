const { MongoClient } = require("mongodb");

let client;
let db;

const connectDB = async () => {
  client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db(process.env.MONGO_DB);
};

const getDB = () => {
  return db;
};

module.exports = { connectDB, getDB };

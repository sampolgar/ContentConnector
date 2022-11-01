const asyncHandler = require("express-async-handler");
const defaultContent = require("../../content/content.json");
const db = require("../config/db").getDB();
const collection = db.collection(process.env.MONGO_COLLECTION);


const createContent = asyncHandler(async (req, res) => {
  if (!req.is("application/json")) {
    respondToClient(res, 400, "Content-Type must be application/json");
    // res.status(400);
    // throw new Error("Content-Type must be application/json");
  } else if (Object.keys(req.body).length === 0) {
    //if req.body is empty, use default content
    const { result, httpCode } = await createContentHandler(defaultContent);
    respondToClient(res, httpCode, result);
  } else {
    //allow user to pass in content
    const { result, httpCode } = await createContentHandler(req.body);
    respondToClient(res, httpCode, result);
  }
});

//query the DB and return results + httpCode
//using MongoDB insertMany() method
const createContentHandler = async (query) => {
  try {
    const dbResult = await collection.insertMany(query);
    return { result: dbResult, httpCode: 200 };
  } catch (e) {
    console.error(e);
    return { result: e, httpCode: 400 };
  }
};

//query the DB and return results + httpCode
//using MongoDB find() method
const getAllContent = asyncHandler(async (req, res) => {
  const { result, httpCode } = await getAllContentHandler();
  respondToClient(res, httpCode, result);
});

const getAllContentHandler = async () => {
  try {
    const dbResult = await collection.find().toArray();
    return { result: dbResult, httpCode: 200 };
  } catch (e) {
    console.error(e);
    return { result: e, httpCode: 400 };
  }
};

const deleteAllContent = asyncHandler(async (req, res) => {
  const { result, httpCode } = await deleteAllContentHandler();
  respondToClient(res, httpCode, result);
});

const deleteAllContentHandler = async () => {
  try {
    const dbResult = await collection.deleteMany({});
    return { result: dbResult, httpCode: 200 };
  } catch (e) {
    console.error(e);
    return { result: e, httpCode: 400 };
  }
};

const testQuery = asyncHandler(async (req, res) => {
  res.status(200).json("hello");
});

const respondToClient = (res, httpCode, message) => {
  res.status(httpCode).json({ message: message });
};

module.exports = {
  createContent,
  getAllContent,
  deleteAllContent,
  testQuery,
};

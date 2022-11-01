const asyncHandler = require("express-async-handler");
const { db } = require("../config/db");

const createContent = asyncHandler(async (req, res) => {
  if (!req.is("application/json")) {
    respondToClient(res, 400, "Content-Type must be application/json");
    // res.status(400);
    // throw new Error("Content-Type must be application/json");
  } else if (!req.body || req.body == "") {
    //use content.json
    // throw new Error("body must not be empty. Copy the content from content/content.json");
    const content = require("../content/content.json");
    const { result, httpCode } = await queryDb(content);
    respondToClient(res, httpCode, result);
  } else {
    const { result, httpCode } = await queryDb(req.body);
    respondToClient(res, httpCode, result);
  }
});

const getAllContent = asyncHandler(async (req, res) => {});

const deleteAllContent = asyncHandler(async (req, res) => {});

const testQuery = asyncHandler(async (req, res) => {
  console.log("hello");
});

//query the DB and return results + httpCode
const queryDb = async (query) => {
  try {
    const dbResult = await db.insertMany(query);
    return { result: dbResult, httpCode: 200 };
  } catch (e) {
    console.error(e);
    return { result: e, httpCode: 400 };
  }
};

const respondToClient = (res, httpCode, message) => {
  res.status(httpCode).json({ message: message });
};

module.exports = {
  createContent,
  getAllContent,
  deleteAllContent,
  testQuery,
};

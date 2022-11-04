const asyncHandler = require("express-async-handler");
const db = require("../utils/db").getDB();
const collection = db.collection(process.env.MONGO_COLLECTION);
const noSearchNoParentId = require("../utils/dbQueries/noSearchNoParentId");

const getContent = asyncHandler(async (req, res) => {
  
  
  const dbQuery = await formDbQueryFromQueryParams(req.query);
  const { result, httpCode } = await queryMongoDB(dbQuery);
  respondToClient(res, httpCode, result);
});

const formDbQueryFromQueryParams = async (queryParams) => {
  if (queryParams.parentId) {
    queryParams.parentId = queryParams.parentId.split("/").at(-1);
  }

  const { parentId, search } = queryParams;

  if (!search && !parentId) {
    return noSearchNoParentId(queryParams);
  } else if (!search && parentId) {
    console.log("search: " + search + " parentId: " + parentId);
  } else if (search && !parentId) {
    console.log("search: " + search + " parentId: " + parentId);
  } else if (search && parentId) {
    console.log("search: " + search + " parentId: " + parentId);
  }
};

const queryMongoDB = async (query) => {
  try {
    const dbResult = await collection.aggregate(query).toArray();
    return { result: dbResult, httpCode: 200 };
  } catch (e) {
    console.error(e);
    return { result: e, httpCode: 400 };
  }
};

const respondToClient = (res, httpCode, message) => {
  res.status(httpCode).json({ message: message });
};

const getDownload = asyncHandler(async (req, res) => {});

module.exports = {
  getContent,
  getDownload,
};

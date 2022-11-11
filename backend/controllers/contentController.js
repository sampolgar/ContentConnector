const asyncHandler = require("express-async-handler");
const db = require("../utils/db").getDB();
const collection = db.collection(process.env.MONGO_COLLECTION);
//importing db queries
const {
  makeQueryNoSearchNoParentId,
  getParentIdQueryNoSearchNoParentId,
} = require("../utils/dbQueries/noSearchNoParentId");
const {
  noSearchYesParentId,
} = require("../utils/dbQueries/noSearchYesParentId");

const {
  yesSearchNoParentId,
} = require("../utils/dbQueries/yesSearchNoParentId");

const getContent = asyncHandler(async (req, res) => {
  console.log(JSON.stringify(req.query));
  console.log("req.url ", JSON.stringify(req.originalUrl));

  //get the relevent db query
  const dbQuery = await formDbQueryFromQueryParams(req.query);

  //then make the call to the database
  const { result, httpCode } = await queryMongoDB(dbQuery);

  //then respond to the client
  respondToClient(res, httpCode, result);
});

//send the query parameters to a function that returns the correct DB query
const formDbQueryFromQueryParams = async (queryParams) => {
  //it the parentId string is 100/101/103 - we only need 103
  if (queryParams.parentId) {
    queryParams.parentId = queryParams.parentId.split("/").at(-1);
  }

  const { parentId, search } = queryParams;

  if (!search && !parentId) {
    return await noSearchNoParentIdQueryHandler(queryParams);
  } else if (!search && parentId) {
    return await noSearchYesParentId(queryParams);
  } else if (search && !parentId) {
    return await yesSearchNoParentId(queryParams);
  } else if (search && parentId) {
    console.log("search: " + search + " parentId: " + parentId);
  }
};

//there are 3 scenarios where there is no search and no parentId
//1. the content system has no folders and wants to return all content
//2. the content system has a parent-child-content folder structure and wants to return 1 parent folder or multiple parent folders
//3. the content system has both folders and images at the root level and wants to return both (like a computer file system)
//
const noSearchNoParentIdQueryHandler = async (queryParams) => {
  //first get the dbQuery
  const dbQuery = await getParentIdQueryNoSearchNoParentId(queryParams);

  //then query the database to get the lowest parentid folder
  const parentIdResult = await collection.aggregate(dbQuery).toArray();

  //Add the lowest parentId folder to the queryParams object
  queryParams.parentId = parentIdResult[0].minParentId;

  // because this is now a request with a parentId, we'll use the parentId query (query 2)
  return await noSearchYesParentIdHandler(queryParams);
};

// const noSearchYesParentIdHandler = async (queryParams) => {
//   //get the db query from noSearchNoParentId.js
//   return await noSearchYesParentId(queryParams);
// };

// const yesSearchNoParentIdHandler = async (queryParams) => {
//   //get the db query from yesSearchNoParentId.js
//   return await yesSearchNoParentId(queryParams);
// };

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
  res.status(httpCode).json(message[0]);
};

const getDownload = asyncHandler(async (req, res) => {});

module.exports = {
  getContent,
  getDownload,
};

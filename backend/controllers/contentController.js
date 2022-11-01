const { ok } = require("assert");
const { query } = require("express");
const asyncHandler = require("express-async-handler");
const db = require("../utils/db").getDB();
const collection = db.collection(process.env.MONGO_COLLECTION);

//get download

//get content from the DB
//scenarios needing to be handled:
// MongoDB $match
//1.    ?skip=0&limit=30&contentType=image&parentId=
//2.    ?skip=0&limit=30&contentType=image&parentId=100
//3.    ?skip=0&limit=30&contentType=image&parentId=100%2f102
// MongoDB $search
//4.    ?skip=0&limit=30&contentType=image&parentId=&search=cat
//5.    ?skip=0&limit=30&contentType=image&parentId=100&search=cat
//6.    ?skip=0&limit=30&contentType=image&parentId=100%2f102&search=possum
// support paging
//      ?skip=1&limit=30
//      ?skip=2&limit=30
//support counting
//https://www.mongodb.com/docs/atlas/atlas-search/counting/
//https://www.mongodb.com/docs/atlas/atlas-search/counting/#std-label-count-ref

const getContent = asyncHandler(async (req, res) => {
  console.log("hellow");
  // parse query params in the query param handler
  // response denotes which handler to use
  //   res.status(200).json({ message: "get content" });
});

const queryParamHandler = (queryParams) => {
  // switch statement to handle the different scenarios
  //if contentType doesn't exist, return error
  //query:                          ?skip=0&limit=30&contentType=
  //
  //if parentId exists, ensure it's only 3 digits long (the last 3 digits) - send it to the parentIdQueryHandler e.g 100/102/103 -> 103 and replace the current parentId with it
  //query:                          ?skip=0&limit=30&contentType=image&parentId=103
  //
  //if search - use searchQueryHandler
  //query:                          ?skip=0&limit=30&contentType=image&parentId=&search=cat
  //query:                          ?skip=0&limit=30&contentType=image&parentId=100&search=cat
  //
  //if parentId - use parentIdQueryHandler
  //query:                          ?skip=0&limit=30&contentType=image&parentId=100
  //
  //if none of the above - use noParentIdQueryHandler
  //query:                          ?skip=0&limit=30&contentType=image or ?skip=0&limit=30&contentType=image&parentId=
  //
};

const parentIdQueryHandler = (queryParams) => {
  //if parentId is longer than 3, use the last 3 digits (or slice it at the last /)
  //return the last parentId
};

const searchQueryHandler = (queryParams) => {
  // if parentId exists, use searchQueryWithFolder
  // if parentId doesn't exist, use searchQueryNoFolder
};

// 1. query param handler
// 2. Ensure the parent ID is ok
// 3. build the DB query - each individually
// 4. run the DB query (together)
// 5. return the response (together)

const getDownload = asyncHandler(async (req, res) => {});

module.exports = {
  getContent,
  getDownload,
};

const asyncHandler = require("express-async-handler");
const db = require("../config/db").getDB();
const collection = db.collection(process.env.MONGO_COLLECTION);

//get download

//get content from the DB
//scenarios needing to be handled:
//1.    ?skip=0&limit=30&contentType=image&parentId=
//2.    ?skip=0&limit=30&contentType=image&parentId=100
//3.    ?skip=0&limit=30&contentType=image&parentId=100%2f102
//4.    ?skip=0&limit=30&contentType=image&parentId=&search=cat
//5.    ?skip=0&limit=30&contentType=image&parentId=100&search=cat
//6.    ?skip=0&limit=30&contentType=image&parentId=100%2f102&search=possum
//
//

const getContent = asyncHandler(async (req, res) => {
  // parse query params in the query param handler
  // response denotes which handler to use
});

const queryParamHandler = (queryParams) => {
  // switch statement to handle the different scenarios
  //if contentType doesn't exist, return error
  //query:                          ?skip=0&limit=30&contentType=
  //
  //if parentId exists, ensure it's only 3 digits long (the last 3 digits) - send it to the parentIdQueryHandler e.g 100/102/103 -> 103
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

const searchQueryHandler = (queryParams) => {
  // if parentId exists, use searchQueryWithFolder
  // if parentId doesn't exist, use searchQueryNoFolder
};

const parentIdQueryHandler = (queryParams) => {
  //if parentId is longer than 3, use the last 3 digits (or slice it at the last /)
  //return the last parentId
};

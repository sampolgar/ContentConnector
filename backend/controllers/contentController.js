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
    // ensure contentType exists, otherwise return error
    //if contentType doesn't exist, return error
    //if parentId exists and is longer than 3 characters, get the last 3 characters 
    //if search - use searchQueryHandler
    //if parentId - use parentIdQueryHandler
    //if neither - use noParentIdQueryHandler
}
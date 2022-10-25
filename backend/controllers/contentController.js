const asyncHandler = require("express-async-handler");
const Content = require("../model/contentModel");

// @desc Get Content
// @route GET /content
const getContent = asyncHandler(async (req, res) => {
  //make the mongodb query - if no query params, return all content
  req.query
    ? (dbQuery = makeDBQueryFromQueryParams(req.query))
    : (dbQuery = {});

  //get the total count of documents that match the query
  const totalQueryCount = await getTotalQueryCount(dbQuery);

  //get the query content from the DB
  const content = await executeQuery(dbQuery, req.query.skip, req.query.limit);

  //make the response to Templafy
  let queryResponse = {};
  if (content.length > 0) {
    queryResponse = await makeQueryResponseToTemplafy(
      totalQueryCount,
      req.query.skip,
      content
    );
  } else {
    queryResponse = await makeQueryResponseToTemplafy(0, 0, []);
  }
  //send the response to Templafy
  res.status(200).json(queryResponse);
});

const makeDBQueryFromQueryParams = (query) => {
  const { contentType = "", parentId = "", search = "", ...unusedVars } = query;

  let dbQuery = {};
  dbQuery.$and = [];

  //if the search query param is not empty, add it to the query
  if (search) {
    dbQuery.$text = { $search: `*${search}*` };
  }
  //if the parentId is available, add the parentId to the query which will find the subfolders / images in the parentId
  if (parentId) {
    dbQuery.$or = [];
    dbQuery.$or.push({ parentId: parentId });
    dbQuery.$and.push({ parentId: parentId.slice(-3) });
  }
  //content type should always be available
  if (contentType) {
    dbQuery.$and.push({ contentType: contentType });
  }
  return dbQuery;
};

//execute the $find query with mongodb
const executeQuery = async (dbQuery, skipper, limiter) => {
  console.log("dbQuery ", dbQuery);
  console.log(skipper + " skip" + limiter + " limit");
  const content = await Content.find(dbQuery).skip(skipper).limit(limiter);
  return content;
};

//get the contentCount by counting the document count that matches the query
const getTotalQueryCount = async (dbQuery) => {
  const totalDocumentCount = await Content.countDocuments(dbQuery);
  return totalDocumentCount;
};

//make the response to Templafy
const makeQueryResponseToTemplafy = (
  theContentCount,
  theOffset,
  theContent
) => {
  return {
    contentCount: theContentCount,
    offset: theOffset,
    content: theContent,
  };
};

//@desc getDownload
//@route GET /content/:id
const getDownload = asyncHandler(async (req, res) => {
  const dbQuery = { id: req.params.id };
  let content = await Content.find(dbQuery);

  if (content.length > 0) {
    let downloadObj = { downloadUrl: content[0].downloadUrl };
    res.status(200).send(downloadObj);
  } else {
    res.status(400);
    throw new Error("no id found");
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//                     Helper functions for building, not needed for Production
//
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//@desc Set Content - send an array of objects into the database - the format must match the Content model in the model folder
//@route POST /content
const setContent = asyncHandler(async (req, res) => {
  if (req.header.contentType != "application/json") {
    res.status(400);
    throw new Error("Content type must be application/json");
  } else if (isEmptyObject(req.body)) {
    res.status(400);
    throw new Error("body must not be empty");
  }

  Content.insertMany(req.body)
    .then((result) => {
      console.log("result: " + result);
      res.status(200).json({ success: "new documents added!", data: result });
    })
    .catch((err) => {
      console.log("err: " + err);
      res.status(400).json({ error: err });
    });
});

//check input is not null
const isEmptyObject = (obj) => {
  console.log("hello");
  console.log(Object.keys(obj).length === 0);
  return Object.keys(obj).length === 0;
};

// //@desc Delete Content from the database - used in Testing
// //@route POST /content
const deleteContent = asyncHandler(async (req, res) => {
  Content.deleteMany({})
    .then((result) => {
      console.log("result: " + result);
      res.status(200).json({ success: "documents deleted!", data: result });
    })
    .catch((err) => {
      console.log("err: " + err);
      res.status(400).json({ error: err });
    });
});

module.exports = {
  getContent,
  getDownload,
  setContent,
  deleteContent,
};

const asyncHandler = require("express-async-handler");
const Content = require("../model/contentModel");

// @desc Get Content
// @route GET /content
const getContent = asyncHandler(async (req, res) => {
  console.log("req.url ", JSON.stringify(req.originalUrl));

  //make the mongodb query - if no query params, return all content
  req.query ? (dbQuery = makeQueryFromQueryParams(req.query)) : (dbQuery = {});

  //get the total count of documents that match the query
  const totalQueryCount = await getTotalQueryCount(dbQuery);

  //get the query content from the DB
  const content = await executeQuery(dbQuery);

  //make the response to Templafy
  let queryResponse = {};
  if (content.length > 0) {
    queryResponse = await makeResponse(
      totalQueryCount,
      req.query.skip,
      content
    );
  } else {
    queryResponse = await makeResponse(0, 0, []);
  }

  //send the response to Templafy
  res.status(200).json(queryResponse);
});

//make the mongoDB query from the query params
const makeQueryFromQueryParams = (query) => {
  const { contentType = "", parentId = "", search = "", ...unusedVars } = query;

  let dbQuery = {};
  dbQuery.$and = [];

  if (search) {
    dbQuery.$text = { $search: `*${search}*` };
  }
  if (parentId) {
    dbQuery.$or = [];
    dbQuery.$or.push({ parentId: parentId });
    dbQuery.$and.push({ parentId: parentId.slice(-3) });
  }
  if (contentType) {
    dbQuery.$and.push({ contentType: contentType });
  }
  console.log("dbQuery", dbQuery);
  return dbQuery;
};

//execute the $find query with mongodb
const executeQuery = async (dbQuery) => {
  const content = await Content.find(dbQuery)
    .skip(dbQuery.skip)
    .limit(dbQuery.limit);
  return content;
};

//get the contentCount by counting the document count that matches the query
const getTotalQueryCount = async (dbQuery) => {
  const totalDocumentCount = await Content.countDocuments(dbQuery);
  return totalDocumentCount;
};

//make the response to Templafy
const makeResponse = (theContentCount, theOffset, theContent) => {
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
    downloadObj = { downloadUrl: content[0].downloadUrl };
    res.status(200).json(downloadObj);
  }
  res.status(400);
  throw new Error("no id found");
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//                     Helper functions for building, not needed for Production
//
//
//
//@desc Set Content - send an array of objects into the database - the format must match the Content model in the model folder
//@route POST /content
const setContent = asyncHandler(async (req, res) => {
  console.log(req.body);
  if (!isEmptyObject(req.body)) {
    console.log("type " + typeof req.body);
    Content.insertMany(req.body)
      .then((result) => {
        console.log("result: " + result);
        res.status(200).json({ success: "new documents added!", data: result });
      })
      .catch((err) => {
        console.log("err: " + err);
        res.status(400).json({ error: err });
      });
  } else {
    res.status(400);
    throw new Error("add content in body - must be an array of objects");
  }
});

const isEmptyObject = (obj) => {
  console.log("hello");
  console.log(Object.keys(obj).length === 0);
  return Object.keys(obj).length === 0;
};

// //@desc Delete Content
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

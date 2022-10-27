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

  if (contentType) {
    dbQuery.$and.push({ contentType: contentType });
  }
  //if the parentId is available, add the parentId to the query which will find the subfolders / images in the parentId
  if (!parentId || parentId === "null") {
    dbQuery.$and.push({ parentId: parentId.slice(-3) });
    dbQuery.$or = [{ contentType: "folder", parentId: parentId.slice(-3) }];
  } else {
    dbQuery.$and.push({ parentId: parentId.slice(-3) });
    dbQuery.$or = [{ contentType: "folder", parentId: parentId.slice(-3) }];
  }
  //content type should always be available

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

module.exports = {
  getContent,
  getDownload,
};

const asyncHandler = require("express-async-handler");
const Content = require("../model/contentModel");
const ContentResponse = require("../model/contentResponseModel");

// @desc Get Content
// @route GET /content
const getContent = asyncHandler(async (req, res) => {
  const dbQuery = makeQuery(req.query);

  let content = "";

  if (req.query.search) {
    content = await Content.aggregate([dbQuery]);
  } else {
    content = await Content.find(dbQuery);
  }

  if (content.length > 0) {
    const contentResponse = await ContentResponse.create({
      contentCount: "1",
      offset: "0",
      content: content,
    });
    res.status(200).json(contentResponse);
  }
});

//@desc Set Content
//@route POST /content
const setContent = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error("add content");
  }

  const content = await Content.create({
    id: req.body.id,
    parentId: req.body.parentId,
    mimeType: req.body.mimeType,
    previewUrl: req.body.previewUrl,
    downloadUrl: req.body.downloadUrl,
    name: req.body.name,
    tags: req.body.tags,
  });
  res.status(200).json(content);
});

//@desc getDownload
//@route GET /content/:id
const getDownload = asyncHandler(async (req, res) => {
  const dbQuery = makeQuery(req.query);
  const downloadObj = await Content.find(dbQuery)
  console.log('downloadObj', JSON.stringify(downloadObj))

  if (!downloadObj) {
    res.status(400);
    throw new Error("content not found");
  }

  let downloadUrlObj = {};
  downloadUrlObj.downloadUrl = downloadObj.downloadUrl;
  console.log("downloadUrl: " + downloadUrlObj);
  res.status(200).json(downloadUrlObj);
});

//@desc db query formatter for query parameters
function makeQuery(query) {
  let dbQuery = {};
  if (query.id) {
    dbQuery.id = query.id;
  }
  if (query.parentId) {
    //use slice to change the parentId to just the parent e.g. change 101/102 => 102
    dbQuery.parentId = query.parentId.slice(-3);
  }
  if (query.contentType) {
    dbQuery.mimeType = { $in: mapContentTypeToMimeTypes(query.contentType) };
  }
  if (query.search) {
    dbQuery.$search = {
      wildcard: {
        query: "*" + query.search + "*",
        path: {
          wildcard: "*",
        },
        allowAnalyzedField: true,
      },
    };
  }
  console.log("the query" + JSON.stringify(dbQuery));
  return dbQuery;
}

function mapContentTypeToMimeTypes(contentType) {
  switch (contentType) {
    case "image":
      return [
        "application/vnd.templafy.folder",
        "image/jpeg",
        "image/png",
        "image/svg+xml",
      ];
    case "textElement":
      return [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
    case "pdf":
      return ["application/pdf"];
    case "slide":
      return [
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];
    case "slideElement":
      return [
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];
    default:
      return [];
  }
}

module.exports = {
  getContent,
  getDownload,
  setContent,
};

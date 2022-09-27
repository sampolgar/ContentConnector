const asyncHandler = require("express-async-handler");
const Content = require("../model/contentModel");
const ContentResponse = require("../model/contentResponseModel");

// @desc Get Content
// @route GET /content
const getContent = asyncHandler(async (req, res) => {
  const dbQuery = makeQuery(req.query);
  let content = ""
  
  if (req.query.search){
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

function makeQuery(query) {
  let dbQuery = {};
  if (query.parentId) {
    dbQuery.parentId = query.parentId;
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
        "allowAnalyzedField": true
      }
    };
    }
  console.log("the query" + JSON.stringify(dbQuery));
  return dbQuery;
}

function mapContentTypeToMimeTypes(contentType) {
  switch (contentType) {
    case "image":
      return ["image/jpeg", "image/png", "image/svg+xml"];
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
  setContent,
};

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

//@desc getDownload
//@route GET /content/:id
const getDownload = asyncHandler(async (req, res) => {
  const dbQuery = { id: req.params.id };
  let content = await Content.find(dbQuery);
  if (content.length > 0) {
    downloadObj = {downloadUrl: content[0].downloadUrl};
    res.status(200).json(downloadObj);
  }
  res.status(400);
  throw new Error("no id found");
});

//@desc db query formatter for query parameters
function makeQuery(query) {
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
  return dbQuery;
}

// @desc map content type to mime types
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

//@desc Set Content -- for testing only
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

module.exports = {
  getContent,
  getDownload,
  setContent,
};
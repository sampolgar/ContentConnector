const asyncHandler = require("express-async-handler");
const Content = require("../model/contentModel");
const ContentResponse = require("../model/contentResponseModel");

// @desc Get Content
// @route GET /content
// const getContent = asyncHandler(async (req, res) => {
//   console.log("hello 0");
//   const dbQuery = makeQuery(req.query);
//   let content = "";

//   //if its a search query, we need to use the mongodb aggregate search, otherwise use the find
//   if (dbQuery.$search) {
//     content = await Content.aggregate([
//       { $search: dbQuery.$search },
//       { $match: dbQuery },
//     ]);
//   } else {
//     content = await Content.find(dbQuery);
//   }

//   //if we receive content back, we need to map the content to the response model
//   if (content.length > 0) {
//     const contentResponse = await ContentResponse.create({
//       contentCount: "1",
//       offset: "0",
//       content: content,
//     });
//     res.status(200).json(contentResponse);
//   } else {
//     res.status(404);
//     throw new Error("Content not found");
//   }
// });

const getContent = asyncHandler(async (req, res) => {
  console.log("1");
  const dbQuery = makeQuery(req.query);
  let content = "";

  if (req.query.search) {
    console.log("2");
    content = await Content.aggregate([dbQuery]);
  } else {
    console.log("3");
    content = await Content.find(dbQuery);
  }

  if (content.length > 0) {
    console.log("4");
    const contentResponse = await ContentResponse.create({
      contentCount: "1",
      offset: "0",
      content: content,
    });
    console.log("5");
    res.status(200).json(contentResponse);
  } else {
    res.status(404);
    throw new Error("Content not found");
  }
});

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

//@desc db query formatter for query parameters
// separate search query from other query
function makeQuery(query) {
  if (query.search) {
    const query = makeSearchAggregateQuery(query);
  } else {
    const query = makeFindQuery(query);
  }
  return query;
}

function makeSearchAggregateQuery(query) {
  dbQuery.$search = {
    wildcard: {
      query: "*" + query.search + "*",
      path: {
        wildcard: "*",
      },
      allowAnalyzedField: true,
    },
  };
  return dbQuery;
}

function makeFindQuery(query) {
  let dbQuery = {};
  if (query.parentId) {
    //use slice to change the parentId to just the parent e.g. change 101/102 => 102
    console.log("6");
    dbQuery.parentId = query.parentId.slice(-3);
  }
  if (query.contentType) {
    console.log("7");
    dbQuery.mimeType = { $in: mapContentTypeToMimeTypes(query.contentType) };
  }

  console.log("9");
  return dbQuery;
}

// @desc map content type to mime types
// e.g. Templafy sends us content type "image", we need to find all images in the form of image/jpeg, image/png, image/svg+xml
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

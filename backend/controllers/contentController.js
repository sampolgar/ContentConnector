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
  console.log("dbquery the" + JSON.stringify(dbQuery));

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

function makeQuery(query) {
  console.log("11");
  let dbQuery = {};
  if (query.search) {
    dbQuery = makeSearchAggregateQuery(query);
  } else {
    console.log("12");
    dbQuery = makeFindQuery(query);
  }
  console.log("13");
  return dbQuery;
}

function makeSearchAggregateQuery(query) {
  let dbQuery = {};
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

  dbQuery.mimeType = { $in: mapContentTypeToMimeTypes(query.contentType) };

  console.log("9");
  return dbQuery;
}

function getParentFolderId(contentId) {
  return contentId.slice(0, -3);
}

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

const isArray = (obj) => {
  console.log(obj.isArray ? false : true);
  return obj.isArray ? true : false;
};

// //@desc Delete Content -- for testing only
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

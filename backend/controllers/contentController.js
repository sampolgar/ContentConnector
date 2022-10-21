const asyncHandler = require("express-async-handler");
const { restart } = require("nodemon");
const Content = require("../model/contentModel");
const ContentResponse = require("../model/contentResponseModel");
const mongoose = require("mongoose");

// @desc Get Content
// @route GET /content
const getContent = asyncHandler(async (req, res) => {
  console.log("req.url ", JSON.stringify(req.originalUrl));

  const dbQuery = makeQuery(req.query);

  const totalQueryCount = await totalQueryCounter(dbQuery);

  const currentQueryCount = await currentQueryCounter(dbQuery);

  const content = await mongoFinder(dbQuery);

  const offset = res.status(200).json(content);
});

const makeQuery = (query) => {
  const { contentType = "", parentId = "", search = "", ...unusedVars } = query;

  let dbQuery = {};
  dbQuery.$and = [];
  dbQuery.$or = [];

  if (search) {
    dbQuery.$text = { $search: `*${search}*` };
  }
  if (parentId) {
    dbQuery.$or.push({ parentId: parentId });
    dbQuery.$and.push({ parentId: parentId.slice(-3) });
  }
  if (contentType) {
    dbQuery.$and.push({ contentType: contentType });
  }
  console.log("dbQuery", dbQuery);
  return dbQuery;
};

const mongoFinder = async (dbQuery) => {
  const content = await Content.find(dbQuery)
    .skip(dbQuery.skip)
    .limit(dbQuery.limit);
  return content;
};

const currentQueryCounter = async (dbQuery) => {
  
}

const totalQueryCounter = async (dbQuery) => {
  const totalDocumentCount = await Content.countDocuments(dbQuery);
  return totalDocumentCount;
};

const makeResponse = (contentResponse) => {};

//@desc Set Content -- for testing only, use to post content to the db
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

module.exports = {
  getContent,
  getDownload,
  setContent,
  deleteContent,
};

const Content = require("../model/contentModel");

const asyncHandler = require("express-async-handler");

// @desc Create Content
// @route POST /setup/createcontent
const createContent = asyncHandler(async (req, res) => {

  if (!req.is("application/json")) {
    res.status(400);
    throw new Error("Content-Type must be application/json");

  } else if (isEmptyObject(req.body)) {
    res.status(400);
    throw new Error("body must not be empty. Copy the content from content/content.json");

  } else {
    Content.insertMany(req.body)
      .then((result) => {
        console.log("result: " + result);
        res.status(200).json({ success: "new documents added!", data: result });
      })
      .catch((err) => {
        console.log("err: " + err);
        res.status(400).json({ error: err });
      });
  }
});

// @desc Helper function to check input is not null
const isEmptyObject = (obj) => {
  console.log("hello");
  console.log(Object.keys(obj).length === 0);
  return Object.keys(obj).length === 0;
};

//@desc Get all content to test the content is in the DB
// @route GET /setup/getallcontent

const getAllContent = asyncHandler(async (req, res) => {
  Content.find({})
    .then((result) => {
      console.log("result: " + result);
      res.status(200).json({ success: "documents found!", data: result });
    })
    .catch((err) => {
      console.log("err: " + err);
      res.status(400).json({ error: err });
    });
});

//@desc Delete all content to help with testing if needed
// @route DELETE /setup/deleteallcontent

const deleteAllContent = asyncHandler(async (req, res) => {
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
  createContent,
  getAllContent,
  deleteAllContent,
};

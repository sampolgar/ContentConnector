const asyncHandler = require("express-async-handler");
const Content = require("../model/contentModel");
const ContentResponse = require("../model/contentResponseModel");

// @desc Get Content
// @route GET /content
const getContent = asyncHandler(async (req, res) => {
  console.log("hello 0");

  const filter = { contentType: "image" };

  let docs = await Content.aggregate([{ $match: filter }]);

  let query = [
    {
      $match: {
        contentType: "image",
      },
    },
  ];

  const content = await Content.aggregate(query);

  // const query = await Content.find();
  res.status(200).json(content);
});

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

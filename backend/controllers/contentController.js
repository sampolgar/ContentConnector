const asyncHandler = require("express-async-handler");
const Content = require("../model/contentModel");

const {
  findQuery,
  searchQueryNoFolder,
  searchQueryWithFolder,
} = require("./dbQueries");

const getContent = asyncHandler(async (req, res) => {
  
  
});

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

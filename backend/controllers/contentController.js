const asyncHandler = require("express-async-handler");
const Content = require("../model/contentModel");
const ContentResponse = require("../model/contentResponseModel");

// @desc Get Content
// @route GET /content

const getContent = asyncHandler(async (req, res) => {
  const content = await Content.find();
//   if content response isn't empty, create response
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
  setContent,
};
const express = require("express");
const router = express.Router();
const {
  getContent,
  getDownload,
  setContent,
  deleteContent,
} = require("../controllers/contentController");

router.route("/").get(getContent).post(setContent).delete(deleteContent);
router.route("/:id/download-url").get(getDownload);

module.exports = router;

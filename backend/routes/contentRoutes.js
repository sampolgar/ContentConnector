const express = require("express");
const router = express.Router();
const { getContent, getDownload } = require("../controllers/contentController");

router.route("/").get(getContent);
router.route("/:id/download-url").get(getDownload);

module.exports = router;

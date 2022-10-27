const express = require("express");
const router = express.Router();
const {
  createContent,
  getAllContent,
  deleteAllContent,
} = require("../controllers/setupController");

//setup routes
router
  .route("/")
  .post(createContent)
  .get(getAllContent)
  .delete(deleteAllContent)

module.exports = router;

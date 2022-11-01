const express = require("express");
const router = express.Router();
const {
  createContent,
  getAllContent,
  deleteAllContent,
  testQuery,
} = require("../controllers/setupController");

//setup routes
router
  .route("/")
  .post(createContent)
  .get(getAllContent)
  .delete(deleteAllContent);

router.route("/testquery").post(testQuery);

module.exports = router;

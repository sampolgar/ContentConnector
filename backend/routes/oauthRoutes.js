const express = require("express");
const router = express.Router();
const { setOauth } = require("../controllers/oauthController");

router.route("/").post(setOauth);

module.exports = router;

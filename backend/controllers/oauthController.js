// const asyncHandler = require("express-async-handler");

// @desc Set OAuth
// @route POST /oauth/token

const setOauth = async (req, res) => {
      //logging
  const query = req.query;
  console.log(JSON.stringify(req.query));

  const headers = req.headers;
  console.log(JSON.stringify(headers));

  console.log("req.url ", JSON.stringify(req.originalUrl));

  console.log("body: " + JSON.stringify(req.body));
    if (!req.body) {
        res.status(400);
        throw new Error("didn't receive body, check your request");
    } else if (!req.body.client_id) {
        res.status(400);
        throw new Error("add a client_id field");
    } else if (!req.body.client_secret) {
        res.status(400);
        throw new Error("add a client_secret field");
    } else if (!req.body.grant_type || req.body.grant_type !== "client_credentials") {
        res.status(400);
        throw new Error("add a grant_type = client_credentials field");
    }

    const oauthToken = {"access_token": "fake_access_token"}
    res.status(200).json(oauthToken);
}

module.exports = { setOauth };
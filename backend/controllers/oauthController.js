const setOauth = async (req, res) => {
  res.status(200).json({ access_token: "oauth-fake-token" });
};

module.exports = { setOauth };

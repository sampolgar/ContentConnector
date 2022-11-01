const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const port = process.env.PORT;
const { connectDB } = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

// connect to the DB before starting the server
connectDB().then(() => {
  //start express
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(errorHandler); //this will override default error handler
  app.listen(port, () => console.log(`Server running on port ${port}`));

  //setup routes
  // app.use("/oauth/token", require("./routes/oauthRoutes"));
  // app.use("/content", require("./routes/contentRoutes"));
  app.use("/setup", require("./routes/setupRoutes"));
});

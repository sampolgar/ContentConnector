const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const port = process.env.PORT;
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/oauth/token", require("./routes/oauthRoutes"));
app.use("/content", require("./routes/contentRoutes"));

app.use(errorHandler); //this will override default error handler

app.listen(port, () => console.log(`Server running on port ${port}`));

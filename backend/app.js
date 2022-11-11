const cookieParser = require("cookie-parser");
const express = require("express");
const errorMiddleware = require("./middlewares/error");
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");

// initializing app
const app = express();

// common middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1", product);
app.use("/api/v1", user);

// middleware for errors
app.use(errorMiddleware);

module.exports = app;

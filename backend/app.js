const express = require("express");
const product = require("./routes/productRoute");
const errorMiddleware = require("./middlewares/error");

// initializing app
const app = express();

// common middlewares
app.use(express.json());

// routes
app.use("/api/v1", product);

// middleware for errors
app.use(errorMiddleware);

module.exports = app;

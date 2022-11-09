const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Register A User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await userModel.create({
    name,
    email,
    password,
    avatar: {
      public_id: "profilePublicId",
      url: "profilePicUrl",
    },
  });

  const token = () => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  };

  res.status(201).json({
    success: true,
    token: token(),
  });
});

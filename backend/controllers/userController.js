const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const userModel = require("../models/userModel");

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

  const token = user.getToken();

  res.status(201).json({
    success: true,
    token,
  });
});

// login a user
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("please enter email & password", 400));
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const token = user.getToken();

  res.status(200).json({
    success: true,
    token,
  });
});

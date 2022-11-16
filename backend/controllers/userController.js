const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const userModel = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");

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

  sendToken(user, 201, res);
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

  sendToken(user, 200, res);
});

// logout a user
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout Successfully",
  });
});

// forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const token = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: true });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${token}`;

  const message = `Your pasword reset token is :- \n\n ${resetPasswordUrl} \n\n In case, if you have not requested this password recovery, then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce password recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email has been send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: true });
    return next(new ErrorHandler(error.message, 404));
  }
});

// reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "password reset token is invalid or token has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("password doesnt match!", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});

// Get My(Jiski Id h vo khud) Details
exports.GetMyDetails = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update My(Jiski Id h vo khud) Password
exports.UpdateMyPassword = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is inorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesnt match!", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// Update My(Jiski Id h vo khud) profile
exports.updateMyProfile = catchAsyncError(async (req, res, next) => {
  const newData = {
    email: req.body.email,
    name: req.body.name,
  };

  // we will add cloudinary later

  const user = await userModel.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Get All Users -- Admin (agar admin apni taraf se dekhna chahey)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await userModel.find();

  res.status(200).json({
    sucess: true,
    users,
  });
});

// Get A User Detail -- Admin (agar admin apni taraf se dekhna chahey)
exports.getUserDetail = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler("User does not exist with ID: " + req.params.id, 400)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Role --Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await userModel.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  if (!user) {
    return next(new ErrorHandler("User does not exist", 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete A User --Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User does not exist", 400));
  }
  // we will remove cloudinary later

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User has been deleted",
  });
});

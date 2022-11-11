const catchAsyncError = require("../middlewares/catchAsyncError");
const productModel = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");

// Get all products
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  // for pagination, result per page
  const resultPerPage = 5;
  const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    products,
  });
});

// Create a product -- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = req.body;
  const savedProduct = await productModel.create(product);

  res.status(200).json({
    success: true,
    savedProduct,
  });
});

// Update product -- Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
    message: "product updated successfully",
  });
});

// Get product details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete product -- Admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  product.remove();

  res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
});

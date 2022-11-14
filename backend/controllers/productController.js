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

// Create or update product reveiws
exports.createProductReveiws = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await productModel.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((r) => {
      if (r.user.toString() === req.user._id.toString()) {
        r.rating = rating;
        r.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let average = 0;

  product.ratings = product.reviews.forEach((rev) => {
    average = average + rev.rating;
  });

  product.ratings = average / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
    message: "Review added succesfully",
  });
});

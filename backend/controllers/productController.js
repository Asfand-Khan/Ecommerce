const productModel = require("../models/productModel");

// Get all products
exports.getAllProducts = async (req, res, next) => {
  const products = await productModel.find();
  res.status(200).json({
    success: true,
    products,
  });
};

// Create a product -- Admin
exports.createProduct = async (req, res, next) => {
  const product = req.body;
  const savedProduct = await productModel.create(product);

  res.status(200).json({
    success: true,
    savedProduct,
  });
};

// Update product -- Admin
exports.updateProduct = async (req, res, next) => {
  let product = await productModel.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "product not found",
    });
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
};

// Get product details
exports.getProductDetails = async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "product not found",
    });
  }

  res.status(200).json({
    success: true,
    product,
  });
};

// Delete product -- Admin
exports.deleteProduct = async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "product not found",
    });
  }

  product.remove();

  res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
};

const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  getProductDetails,
  deleteProduct,
} = require("../controllers/productController");
const { isUserAuthenticated, authoriseRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);

router
  .route("/product/new")
  .post(isUserAuthenticated, authoriseRoles("admin"), createProduct);
router
  .route("/product/:id")
  .put(isUserAuthenticated, authoriseRoles("admin"), updateProduct)
  .get(getProductDetails)
  .delete(isUserAuthenticated, authoriseRoles("admin"), deleteProduct);

module.exports = router;

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
  .route("/admin/product/new")
  .post(isUserAuthenticated, authoriseRoles("admin"), createProduct);
router
  .route("/admin/product/:id")
  .put(isUserAuthenticated, authoriseRoles("admin"), updateProduct)
  .delete(isUserAuthenticated, authoriseRoles("admin"), deleteProduct);
router.route("/product/:id").get(getProductDetails);
module.exports = router;

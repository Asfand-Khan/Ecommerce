const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  GetMyDetails,
  UpdateMyPassword,
  updateMyProfile,
  getAllUsers,
  getUserDetail,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { isUserAuthenticated, authoriseRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(forgotPassword);

router.route("/me").get(isUserAuthenticated, GetMyDetails);
router.route("/password/update").put(isUserAuthenticated, UpdateMyPassword);
router.route("/me/update").put(isUserAuthenticated, updateMyProfile);

router
  .route("/admin/users")
  .get(isUserAuthenticated, authoriseRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isUserAuthenticated, authoriseRoles("admin"), getUserDetail)
  .put(isUserAuthenticated, authoriseRoles("admin"), updateUserRole)
  .delete(isUserAuthenticated, authoriseRoles("admin"), deleteUser);

module.exports = router;

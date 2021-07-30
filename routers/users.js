const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  loginUser,
  getAllUsers,
} = require("../controllers/user");

const router = new express.Router();
router
  .route("/")
  .post(auth, createUser)
  .get(auth, authorize("admin"), getAllUsers);

router
  .route("/me")
  .get(auth, authorize("admin"), readUser)
  .patch(auth, authorize("admin"), updateUser)
  .delete(auth, authorize("admin"), deleteUser);

router.route("/login").post(loginUser);

module.exports = router;

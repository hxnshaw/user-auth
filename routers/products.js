const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const {
  createProduct,
  readProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} = require("../controllers/products");

const router = new express.Router();
router
  .route("/")
  .post(auth, authorize("admin", "vendor"), createProduct)
  .get(auth, getAllProducts);

router
  .route("/:id")
  .get(readProduct)
  .patch(auth, authorize("admin", "vendor"), updateProduct)
  .delete(auth, authorize("admin", "vendor"), deleteProduct);

module.exports = router;

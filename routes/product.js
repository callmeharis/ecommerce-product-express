const express = require("express");
const {
  createProduct,
  getProducts,
  getProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/product");
const auth = require("../middleware/auth");
const router = express.Router();

// router.route("/").get(getProducts).post(createProduct);
router.get("/", getProducts);
router.post("/", createProduct);
router
  .route("/product/:id")
  .get(getProduct)
  .patch(editProduct)
  .delete(deleteProduct);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  checkProduct,
  createProduct,
  fetchProducts,
} = require("../controllers/productController.js");

router.post("/check-product", checkProduct);
router.post("/create-product", createProduct);
router.get("/", fetchProducts);

module.exports = router;

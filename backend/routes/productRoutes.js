const express = require("express");
const router = express.Router();
const {
  checkProduct,
  createProduct,
} = require("../controllers/productController.js");

router.get("/:productName", checkProduct);
router.post("/create-product", createProduct);

module.exports = router;

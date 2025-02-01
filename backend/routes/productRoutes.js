const express = require("express");
const router = express.Router();
const {
  checkProduct,
  createProduct,
} = require("../controllers/productController.js");

router.post("/", checkProduct);
router.post("/create-product", createProduct);

module.exports = router;

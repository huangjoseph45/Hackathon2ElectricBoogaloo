require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../schemas/Product.js");
const { checkExpiration } = require("../OpenAI/checkProductExpiration.js");

const checkProduct = async (req, res) => {
  let { productName } = req.params;
  productName = capitalizeWords(productName);

  if (!productName) {
    console.log(req.params);
    return res.status(400).json({ message: "Product Name is required" });
  }
  try {
    const product = await Product.findOne({ productName: productName });
    if (product) {
      console.log("Product exists");
      const expiration = JSON.parse(await checkExpiration(productName));

      console.log(expiration);
    } else {
      console.log("Product does not exist");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error: " + error });
  }
};

const createProduct = async (req, res) => {
  const { productName, category, isCanned, stockQuantity, expirationDate } =
    req.body;

  if (!productName || !category) {
    return res.status(400).json({
      message: `Missing ${!productName ? "Product Name" : ""} ${
        !category ? "Category" : ""
      } ${!expirationDate ? "Expiration Date" : ""}`,
    });
  }

  try {
    const productInfo = {
      productName: capitalizeWords(productName),
      category: capitalizeWords(category),
      ...(isCanned !== undefined && { isCanned }),
      ...(stockQuantity !== undefined && { stockQuantity }),
      ...(expirationDate !== undefined && { expirationDate }),
    };

    const existingProduct = await Product.findOne({ productName });
    if (existingProduct) {
      const newProduct = await Product.findOneAndUpdate(
        { productName },
        productInfo,
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

      return res.status(201).json({
        message: "Product created successfully. Replaced old product",
        product: newProduct,
      });
    }

    const newProduct = await Product.create(productInfo);

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error: " + error.message });
  }
};

function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

module.exports = {
  checkProduct,
  createProduct,
};

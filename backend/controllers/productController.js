require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../schemas/Product.js");
const ExpirationInfo = require("../schemas/ExpirationInfo.js");
const { checkExpiration } = require("../OpenAI/checkProductExpiration.js");

const fetchProducts = async (req, res) => {
  try {
    const products = await Product.find({}).lean();
    console.log(products);
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error while fetching products: " + error });
  }
};

const checkProduct = async (req, res) => {
  let products = req.body;

  if (!products || products.length < 1) {
    return res.status(400).json({ message: "Product is required" });
  }

  try {
    const productNames = JSON.stringify(
      products.map((product) => {
        return product.productName;
      })
    );
    const expirationInfo = await checkExpiration(productNames); //gets expiration info from chatgpt

    expirationInfo.map((item) => {
      const match = products.find(
        (product) => product.productName === item.foodName
      );
      item["id"] = match._id;
    });

    return res.status(200).json({ expirationInfo: expirationInfo });
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

module.exports = {
  checkProduct,
  createProduct,
  fetchProducts,
};

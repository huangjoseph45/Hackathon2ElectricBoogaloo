const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Dairy",
        "Produce",
        "Meat",
        "Bakery",
        "Beverages",
        "Snacks",
        "Frozen Foods",
        "Medicine",
        "Poultry",
      ],
      index: true,
    },
    isCanned: {
      type: Boolean,
      default: false,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    expirationDate: {
      type: Date,
      default: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      },
    },

    description: {
      type: String,
      maxlength: 500,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");

const expirationSchema = new mongoose.Schema([
    foodName: {
        type: String,
        required: true,
        trim: true,
      },
    isSafe: {
        type: Boolean,
        required: true,
      },
]);

module.exports = mongoose.model("Product", productSchema);

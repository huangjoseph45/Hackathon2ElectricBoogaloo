const mongoose = require("mongoose");

const expirationSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
    trim: true,
  },
  isSafe: {
    type: Boolean,
    required: true,
  },
  explanation: {
    type: String,
  },
  estimatedSafetyDate: {
    type: String,
  },
});

module.exports = mongoose.model("ExpirationInfo", expirationSchema);

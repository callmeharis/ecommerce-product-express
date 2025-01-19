const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please fill title field"],
    minLength: 3,
    maxLength: 20,
  },
  desc: {
    type: String,
    required: [true, "Please fill description field"],
    maxLength: 50,
  },
  price: {
    type: Number,
    required: [true, "Please fill price field"],
  },
  productImage: {
    type: String,
  },
  reviews: [{ type: String }],
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "please provide user"],
  },
});

module.exports = mongoose.model("Product", productSchema);

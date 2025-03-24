const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // Loại sản phẩm
  price: { type: Number, required: true },
  description: String
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);

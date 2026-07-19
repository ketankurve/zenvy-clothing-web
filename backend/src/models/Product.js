// zenvy/backend/src/models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    ethPrice: { type: String, required: true },
    category: { type: String, required: true },
    img: { type: String, required: true },
    tokenId: { type: String, required: true, unique: true }, // Ensure this is unique
    isMinted: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", ProductSchema);


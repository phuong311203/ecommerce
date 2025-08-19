const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  price:       { type: Number, required: true },
  stock:       { type: Number, default: 0 },
  category:    { type: String },
  averageRating: { type: Number, default: 0 },  // ⭐ trung bình
  numReviews: { type: Number, default: 0 },
  seller:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price:    { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items:     [orderItemSchema],
  total:     { type: Number, required: true },
  status:    { type: String, enum: ["pending", "paid", "shipped", "delivered", "canceled"], default: "pending" },
  payment:   { type: String, enum: ["COD", "MoMo", "VNPay", "PayPal"], default: "COD" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);

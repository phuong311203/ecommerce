const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Tạo đơn hàng từ giỏ
exports.createOrder = async (req, res) => {
  try {
    const { payment } = req.body;
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Chuẩn bị dữ liệu order
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total,
      payment
    });

    // Trừ stock sản phẩm
    for (let item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `${product.name} is out of stock` });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    // Xóa giỏ sau khi đặt hàng
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy danh sách đơn hàng của user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy tất cả đơn hàng (chỉ admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "username email").populate("items.product");
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật trạng thái đơn hàng (admin/seller)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

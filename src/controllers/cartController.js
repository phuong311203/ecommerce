const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Xem giỏ hàng của user
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Thêm sản phẩm vào giỏ
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    // Nếu chưa có giỏ thì tạo mới
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [{ product: productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);

      if (itemIndex > -1) {
        // Nếu sản phẩm đã tồn tại -> tăng số lượng
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Nếu chưa có -> thêm mới
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    res.json({ message: "Product added to cart", cart });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật số lượng sản phẩm
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ error: "Product not in cart" });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.json({ message: "Cart updated", cart });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();

    res.json({ message: "Product removed from cart", cart });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

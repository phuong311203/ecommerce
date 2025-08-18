const Product = require('../models/Product');


exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      seller: req.user.id
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "username email");
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "username email");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.seller.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.seller.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

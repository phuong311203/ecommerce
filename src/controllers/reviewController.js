const Review = require("../models/Review");
const Product = require("../models/Product");
// const Review = require('../models/review.model');


// Thêm review
exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Kiểm tra user đã review chưa
    const alreadyReviewed = await Review.findOne({ user: req.user.id, product: productId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này rồi" });
    }

    // Tạo review mới
    const review = new Review({
      user: req.user.id,
      product: productId,
      rating,
      comment
    });

    await review.save();

    // Cập nhật averageRating cho Product
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      averageRating: avgRating.toFixed(1), // 1 chữ số thập phân
      numReviews: reviews.length
    });

    res.status(201).json({ message: "Đánh giá thành công", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewsByProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const reviews = await Review.find({ productId }).populate('userId', 'username email');

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

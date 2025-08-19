const express = require('express');
const Review = require('../models/Review');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware')

// Thêm review
router.post('/', async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;

    const review = new Review({ productId, userId, rating, comment });
    await review.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Lấy tất cả review theo productId
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'username email');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/products/:id/reviews', reviewController.getReviewsByProduct);

router.put('/reviews/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Tìm review
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy review' });
    }

    // Chỉ cho phép user sở hữu review chỉnh sửa
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa review này' });
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    res.json({ message: 'Cập nhật review thành công', review });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật review', error });
  }
});

// DELETE /reviews/:id
router.delete('/reviews/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy review' });
    }

    // Chỉ cho phép user sở hữu review xóa
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa review này' });
    }

    await review.deleteOne();

    res.json({ message: 'Xóa review thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa review', error });
  }
});

// DELETE /admin/reviews/:id
router.delete('/admin/reviews/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy review' });
    }

    await review.deleteOne();

    res.json({ message: 'Admin đã xóa review thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi admin xóa review', error });
  }
});

module.exports = router;
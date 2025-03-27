const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
// Giả sử bạn đã có middleware xác thực token
const authenticateToken = require('../middleware/authenticateToken');

// Lấy giỏ hàng của người dùng hiện tại
router.get('/', authenticateToken, cartController.getCart);

// Thêm sản phẩm vào giỏ hàng
router.post('/add', authenticateToken, cartController.addToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/update', authenticateToken, cartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng (sử dụng :productId trong params)
router.delete('/remove/:productId', authenticateToken, cartController.removeCartItem);

// Xóa toàn bộ giỏ hàng
router.delete('/clear', authenticateToken, cartController.clearCart);

module.exports = router;

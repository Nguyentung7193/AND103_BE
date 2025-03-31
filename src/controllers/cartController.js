const mongoose = require('mongoose');
const Cart = require('../models/Cart');

// Lấy giỏ hàng của người dùng hiện tại theo token
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId; // Đã được giải mã từ token
    let cart = await Cart.findOne({ userID: new mongoose.Types.ObjectId(userId) }).populate('items.product');
    // Nếu giỏ hàng chưa tồn tại, tạo mới rỗng
    if (!cart) {
      cart = new Cart({ userID: userId, items: [] });
      await cart.save();
      return res.status(200).json({
        code: 200,
        msg: "Giỏ hàng trống, đã tạo mới.",
        data: cart
      });
    }
    
    return res.status(200).json({
      code: 200,
      msg: "Lấy giỏ hàng thành công.",
      data: cart
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      msg: "Lỗi máy chủ, không thể lấy giỏ hàng.",
      data: null
    });
  }
};

// Thêm sản phẩm vào giỏ hàng ok
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;
    
    // Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ userID: new mongoose.Types.ObjectId(userId) });
    if (!cart) {
      cart = new Cart({ userID: userId, items: [] });
    }
    
    // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng thì tăng số lượng
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }
    
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng ok 
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;
    
    let cart = await Cart.findOne({ userID: new mongoose.Types.ObjectId(userId) });
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
    
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
    
    // Nếu số lượng là 0 thì xóa sản phẩm khỏi giỏ hàng
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa một sản phẩm khỏi giỏ hàng
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    
    let cart = await Cart.findOne({ userID: new mongoose.Types.ObjectId(userId) });
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
    
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa toàn bộ giỏ hàng (clear cart)
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    let cart = await Cart.findOne({ userID: new mongoose.Types.ObjectId(userId) });
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
    
    cart.items = [];
    await cart.save();
    res.status(200).json({ message: 'Giỏ hàng đã được làm trống' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

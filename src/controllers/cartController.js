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
// exports.updateCartItem = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const productId = req.query.productId;
//     const quantityParam = req.query.quantity;

//     if (!productId) {
//       return res.status(400).json({ message: 'Thiếu productId' });
//     }
//     if (quantityParam === undefined) {
//       return res.status(400).json({ message: 'Thiếu quantity' });
//     }

//     const quantity = parseInt(quantityParam, 10);
//     if (isNaN(quantity)) {
//       return res.status(400).json({ message: 'quantity không hợp lệ' });
//     }
//     const cart = await Cart.findOne({ userID: new mongoose.Types.ObjectId(userId) });
//     if (!cart) {
//       return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
//     }

//     const itemIndex = cart.items.findIndex(
//       item => item.product.toString() === productId
//     );
//     if (itemIndex === -1) {
//       return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
//     }

//     if (quantity <= 0) {
//       cart.items.splice(itemIndex, 1);
//     } else {
//       cart.items[itemIndex].quantity = quantity;
//     }

//     await cart.save();
//     res.status(200).json({ message: 'Cập nhật thành công', data: cart });
//   } catch (error) {
//     console.error('Error in updateCartItem:', error);
//     res.status(500).json({ message: error.message });
//   }
// };
exports.updateCartItem = async (req, res) => {
  try {
    const userId      = req.user.userId;
    const productId   = req.query.productId;
    const quantityParam = req.query.quantity;

    // Kiểm tra đầu vào
    if (!productId) {
      return res.status(400).json({ message: 'Thiếu productId' });
    }
    if (quantityParam === undefined) {
      return res.status(400).json({ message: 'Thiếu quantity' });
    }
    const quantity = parseInt(quantityParam, 10);
    if (isNaN(quantity)) {
      return res.status(400).json({ message: 'quantity không hợp lệ' });
    }

    // Tìm giỏ hàng và đảm bảo là Document
    const cart = await Cart.findOne({ userID: new mongoose.Types.ObjectId(userId) });
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
    }

    // Tìm item cần cập nhật
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
    }

    // Xử lý số lượng
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    // Lưu và populate product
    await cart.save();
    await cart.populate('items.product');

    // Trả về cart đã populate
    res.status(200).json({
      message: 'Cập nhật thành công',
      data: cart
    });
  } catch (error) {
    console.error('Error in updateCartItem:', error);
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

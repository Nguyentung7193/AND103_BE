const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(userId);
        const orders = await Order.find({ userID: userId});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Lấy một đơn hàng theo ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// exports.createOrderFromCart = async (req, res) => {
//     try {
//         const userID = req.user.userId
//         // const userID = req.user._id;
//         const { fullname, address, phone, note, type } = req.body;

//         // 1. Lấy giỏ hàng
//         const cart = await Cart.findOne({ userID }).populate('items.product');
//         if (!cart || cart.items.length === 0) {
//             return res.status(400).json({ message: 'Giỏ hàng trống!' });
//         }

//         // 2. Tính tổng
//         let totalPrice = 0;
//         for (const item of cart.items) {
//             totalPrice += item.product.price * item.quantity;
//         }

//         // 3. Tạo đơn hàng
//         const newOrder = new Order({
//             userID,
//             fullname,
//             address,
//             phone,
//             totalPrice,
//             note,
//             type
//         });

//         const savedOrder = await newOrder.save();

//         // 4. Xoá giỏ
//         await Cart.findOneAndDelete({ userID });

//         res.status(201).json({
//             message: 'Đặt hàng thành công!',
//             order: savedOrder
//         });

//     } catch (error) {
//         console.error('Tạo đơn hàng lỗi:', error);
//         res.status(500).json({ message: 'Lỗi server' });
//     }
// };

// Cập nhật một đơn hàng

exports.createOrderFromCart = async (req, res) => {
    try {
        const userID = req.user.userId;
        const { fullname, address, phone, note, type } = req.body;

        // 1. Lấy giỏ hàng của người dùng
        const cart = await Cart.findOne({ userID }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống!' });
        }

        // 2. Tính tổng giá tiền
        let totalPrice = 0;
        const items = []; // Danh sách các sản phẩm trong đơn hàng
        for (const item of cart.items) {
            totalPrice += item.product.price * item.quantity;
            items.push({
                product: item.product._id,  // ID của sản phẩm
                quantity: item.quantity
            });
        }

        // 3. Tạo đơn hàng mới với các thông tin từ giỏ hàng
        const newOrder = new Order({
            userID,
            fullname,
            address,
            phone,
            totalPrice,
            note,
            type,
            items  // Thêm các sản phẩm vào đơn hàng
        });

        // 4. Lưu đơn hàng
        const savedOrder = await newOrder.save();

        // 5. (Tuỳ chọn) Xoá giỏ hàng sau khi đặt hàng thành công
        await Cart.findOneAndDelete({ userID });

        // Trả về thông tin đơn hàng
        res.status(201).json({
            message: 'Đặt hàng thành công!',
            order: savedOrder
        });

    } catch (error) {
        console.error('Tạo đơn hàng lỗi:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa một đơn hàng
exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.checkout = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      // Lấy giỏ hàng của người dùng
      let cart = await Cart.findOne({ userID: new mongoose.Types.ObjectId(userId) }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Giỏ hàng trống, không thể đặt hàng' });
      }
  
      // Tính tổng tiền
      let totalPrice = 0;
      for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: `Sản phẩm ${item.product} không tồn tại` });
        }
        totalPrice += product.price * item.quantity;
      }
  
      const order = new Order({
        userID: userId,
        items: cart.items,
        totalPrice,
      });
  
      await order.save();
  
      cart.items = [];
      await cart.save();
  
      res.status(201).json({ message: 'Đặt hàng thành công', order });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  exports.checkout = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { fullname, address, phone, note, type } = req.body;

        // Kiểm tra thông tin bắt buộc
        if (!fullname || !address || !phone || !type) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin đặt hàng' });
        }

        // Lấy giỏ hàng của người dùng
        let cart = await Cart.findOne({ userID: new mongoose.Types.ObjectId(userId) }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống, không thể đặt hàng' });
        }

        // Tính tổng tiền
        let totalPrice = 0;
        cart.items.forEach(item => {
            totalPrice += item.product.price * item.quantity;
        });

        // Tạo đơn hàng mới
        const order = new Order({
            userID: userId,
            fullname,
            address,
            phone,
            totalPrice,
            note,
            type
        });
        await order.save();

        // Xóa giỏ hàng sau khi đặt hàng thành công
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: 'Đặt hàng thành công', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
// Thêm một đơn hàng mới
exports.createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Cập nhật một đơn hàng
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

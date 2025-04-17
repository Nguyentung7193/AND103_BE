const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const admin = require("../firebase/firebase-admin");



const sendNotificationToUser = async (fcmToken, title, body) => {
    const message = {
      notification: {
        title,
        body,
      },
      token: fcmToken,
    };
  
    try {
      const response = await admin.messaging().send(message);
      console.log("Thông báo gửi thành công:", response);
    } catch (error) {
      console.error("Lỗi gửi thông báo:", error);
    }
  };

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
        const order = await Order.findById(req.params.id)
            .populate('items.product'); // 👈 lấy đầy đủ thông tin product

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
        const { fullname, address, phone, note, type,fcmToken} = req.body;

        const cart = await Cart.findOne({ userID }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống!' });
        }

        let totalPrice = 0;
        const items = [];
        for (const item of cart.items) {
            totalPrice += item.product.price * item.quantity;
            items.push({
                product: item.product._id,
                quantity: item.quantity
            });
        }
        const newOrder = new Order({
            userID,
            fullname,
            address,
            phone,
            totalPrice,
            note,
            type,
            items
        });

        const savedOrder = await newOrder.save();
        await Cart.findOneAndDelete({ userID });
        if (fcmToken) {
            const title = "Đặt hàng thành công!";
            const body = `Tổng tiền: ${totalPrice.toLocaleString()} VNĐ. Cảm ơn bạn đã mua sắm!`;
            await sendNotificationToUser(fcmToken, title, body);
        } else {
            console.warn("Không nhận được fcmToken từ client");
        }

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
        const { fullname, address, phone, note, type, fcmToken } = req.body;

        if (!fullname || !address || !phone || !type) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin đặt hàng' });
        }

        // Lấy giỏ hàng
        let cart = await Cart.findOne({ userID: new mongoose.Types.ObjectId(userId) }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống, không thể đặt hàng' });
        }

        // Tính tổng tiền
        let totalPrice = 0;
        cart.items.forEach(item => {
            totalPrice += item.product.price * item.quantity;
        });

        // Tạo đơn hàng
        const order = new Order({
            userID: userId,
            fullname,
            address,
            phone,
            totalPrice,
            note,
            type,
            items: cart.items
        });
        await order.save();

        // Xóa giỏ hàng
        cart.items = [];
        await cart.save();

        // 🔔 Gửi thông báo nếu có fcmToken
        if (fcmToken) {
            const title = "Đặt hàng thành công!";
            const body = `Tổng tiền: ${totalPrice.toLocaleString()} VNĐ. Cảm ơn bạn đã mua sắm!`;
            await sendNotificationToUser(fcmToken, title, body);
        } else {
            console.warn("Không nhận được fcmToken từ client");
        }

        res.status(201).json({ message: 'Đặt hàng thành công', order });
    } catch (error) {
        console.error("Lỗi checkout:", error);
        res.status(500).json({ message: error.message });
    }
};

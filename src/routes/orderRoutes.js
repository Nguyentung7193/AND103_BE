const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder, checkout,createOrderFromCart } = require("../controllers/orderController");
const authenticateToken = require("../middleware/authenticateToken");
const Cart = require("../models/Cart");


router.get("/order", authenticateToken, getAllOrders);
router.get("/order/:id", authenticateToken, getOrderById);
// router.post("/order/create", authenticateToken, createOrder);
router.put("/order/update/:id", authenticateToken, updateOrder);
router.delete("/order/delete/:id", authenticateToken, deleteOrder);
router.post("/order/create", authenticateToken,createOrderFromCart);
// Thanh toán giỏ hàng
router.post('/checkout', authenticateToken, checkout);

module.exports = router;
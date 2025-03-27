const express = require("express");
const router = express.Router();
const {getAllOrders,getOrderById,createOrder,updateOrder,deleteOrder} = require("../controllers/orderController");
const authenticateToken = require("../middleware/authenticateToken");


router.get("/order",authenticateToken, getAllOrders);
router.get("/order/:id", getOrderById);
router.post("/order/create", createOrder);
router.put("/order/create/:id", updateOrder);
router.delete("/order/delete/:id", deleteOrder);

module.exports = router;
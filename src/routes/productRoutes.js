const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { getProductsByType,getProductById,searchProductsByName } = require("../controllers/productController");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/type/:type",authenticateToken, getProductsByType);
router.get("/detail/:id",authenticateToken, getProductById);
router.get("/search",authenticateToken, searchProductsByName);

module.exports = router;

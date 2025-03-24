const express = require("express");
const router = express.Router();
const { getProductsByType,getProductById } = require("../controllers/productController");

router.get("/type/:type", getProductsByType);
router.get("/detail/:id", getProductById);

module.exports = router;

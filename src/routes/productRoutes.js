const express = require("express");
const router = express.Router();
const { getProductsByType } = require("../controllers/productController");

router.get("/type/:type", getProductsByType);

module.exports = router;

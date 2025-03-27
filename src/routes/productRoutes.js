const express = require("express");
const router = express.Router();
const { getProductsByType,getProductById,searchProductsByName } = require("../controllers/productController");

router.get("/type/:type", getProductsByType);
router.get("/detail/:id", getProductById);
router.get("/search", searchProductsByName);

module.exports = router;

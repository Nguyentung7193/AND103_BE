const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const { register, login,getInforUser } = require("../controllers/userController");
const authenticateToken = require('../middleware/authenticateToken');

router.post("/register",register);

router.post("/login",login);

router.get("/getInforUser",authenticateToken, getInforUser)

module.exports = router;

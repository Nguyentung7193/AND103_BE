const express = require("express");
const User = require("../models/User");
const { updateUser } = require("../controllers/userController");

const router = express.Router();

// Lấy danh sách user
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Tạo user mới
router.post("/", async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});
router.put("/:id", updateUser);

module.exports = router;

const mongoose = require("mongoose");
const Category = require("../models/categories");
require("dotenv").config();

const sampleCategories = [
  {
    name: "Electronics",
    description: "Các sản phẩm điện tử như điện thoại, laptop, tai nghe."
  },
  {
    name: "Fashion",
    description: "Thời trang bao gồm quần áo, giày dép, phụ kiện."
  },
  {
    name: "Home Appliances",
    description: "Các thiết bị gia dụng như máy giặt, tủ lạnh, lò vi sóng."
  },
  {
    name: "Books",
    description: "Sách thuộc nhiều thể loại khác nhau."
  },
  {
    name: "Sports",
    description: "Dụng cụ thể thao và các sản phẩm liên quan."
  }
];

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("MongoDB connected");

    // Xóa tất cả category trước khi thêm mới (nếu cần)
    await Category.deleteMany();

    // Thêm dữ liệu mẫu
    await Category.insertMany(sampleCategories);
    console.log("Dữ liệu mẫu đã được thêm vào collection Category");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
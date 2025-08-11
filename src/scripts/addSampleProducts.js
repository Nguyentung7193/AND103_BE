const mongoose = require("mongoose");
const Product = require("../models/Products");
require("dotenv").config();

const sampleProducts = [
  {
    name: "iPhone 13",
    type: "electronics",
    price: 999,
    description: "Smartphone cao cấp của Apple."
  },
  {
    name: "Samsung Galaxy S22",
    type: "electronics",
    price: 899,
    description: "Smartphone cao cấp của Samsung."
  },
  {
    name: "Sony WH-1000XM4",
    type: "electronics",
    price: 349,
    description: "Tai nghe chống ồn tốt nhất của Sony."
  },
  {
    name: "Dell XPS 13",
    type: "laptop",
    price: 1199,
    description: "Laptop cao cấp của Dell."
  },
  {
    name: "MacBook Pro 14",
    type: "laptop",
    price: 1999,
    description: "Laptop mạnh mẽ của Apple."
  },
  {
    name: "Nike Air Max 270",
    type: "fashion",
    price: 150,
    description: "Giày thể thao thời trang của Nike."
  }
];

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("MongoDB connected");

    // Xóa tất cả sản phẩm trước khi thêm mới (nếu cần)
    await Product.deleteMany();

    // Thêm dữ liệu mẫu
    await Product.insertMany(sampleProducts);
    console.log("Dữ liệu mẫu đã được thêm vào collection Product");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
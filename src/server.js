const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Đọc dữ liệu JSON từ request

// Định nghĩa route mặc định
app.get("/", (req, res) => {
    res.send("API is running...");
});
app.use("/api/users", userRoutes);
// Sử dụng auth routes
app.use("/api/auth", authRoutes);
// api cho product
app.use("/api/products", productRoutes);

// Kết nối MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

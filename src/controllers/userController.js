const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../firebase/firebase-admin");


exports.loginWithFirebase = async (req, res) => {
    const { idToken } = req.body;
    try {
      // Xác minh idToken từ Firebase
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { email, name, uid } = decodedToken;
  
      // Kiểm tra xem user đã tồn tại trong MongoDB chưa
      let user = await User.findOne({ email });
      if (!user) {
        // Nếu chưa có thì tạo user mới (bạn có thể lưu uid nếu muốn)
        user = new User({
          name: name || "Chưa đặt tên",
          email,
          password: "", // vì login bằng Google nên password có thể để trống
        });
        await user.save();
      }
  
      // Tạo JWT token riêng cho hệ thống của bạn
      const payload = { userId: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.json({
        message: "Đăng nhập bằng Firebase thành công",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Lỗi xác minh Firebase token:", error);
      res.status(401).json({ message: "Token Firebase không hợp lệ hoặc đã hết hạn." });
    }
  };

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Kiểm tra xem email đã được sử dụng chưa
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }
        // Tạo user mới
        user = new User({ name, email, password });
        // Mã hóa password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.status(201).json({ message: "Đăng ký thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email không tồn tại" });
        }
        // So sánh password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng" });
        }
        // Tạo JWT token (JWT_SECRET được định nghĩa trong .env)
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const updates = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                code: 404,
                msg: "Không tìm thấy người dùng",
                data: null,
            });
        }
        return res.json({
            code: 200,
            msg: "Cập nhật thông tin người dùng thành công",
            data: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            msg: error.message,
            data: null,
        });
    }
};
exports.getInforUser = async (req, res) => {
    try {
        const userId = req.user.userId;
      // Tìm người dùng theo id được lấy từ token (đã được middleware verifyToken gán vào req.user)
      const user = await User.findById(userId).select('-password'); // loại bỏ trường password
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ 
        code: 200,
        msg: 'Lấy thông tin người dùng thành công',
        data: user
       });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

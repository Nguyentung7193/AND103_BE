// authMiddleware.js
const jwt = require('jsonwebtoken');



const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  // Nếu không có token thì trả về lỗi 401 Unauthorized
  if (token == null) return res.status(401).json({ message: 'Không có token, truy cập bị từ chối.' });

  // Xác thực token với secret key từ biến môi trường
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // Nếu token không hợp lệ hoặc hết hạn, trả về lỗi 403 Forbidden
    if (err) return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    
    
    // Lưu thông tin user đã giải mã vào request để sử dụng ở các middleware/controller khác
    req.user = user;
    next();
  });
};
module.exports = authenticateToken;

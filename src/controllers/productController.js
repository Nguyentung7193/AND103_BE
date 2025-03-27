const Product = require("../models/Products");

exports.getProductsByType = async (req, res) => {
  try {
    const productType = req.params.type;
    const products = await Product.find({ type: productType });

    return res.json({
      code: 200,
      msg: "Lấy danh sách sản phẩm thành công",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      msg: error.message,
      data: null,
    });
  }
};
exports.getProductById = async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({
          code: 404,
          msg: "Không tìm thấy sản phẩm",
          data: null,
        });
      }
  
      return res.json({
        code: 200,
        msg: "Lấy thông tin sản phẩm thành công",
        data: product,
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        msg: error.message,
        data: null,
      });
    }
  };
  exports.searchProductsByName = async (req, res) => {
    try {
      // Lấy query name từ URL: ví dụ: /api/products/search?name=TV
      const { name } = req.query;
  
      if (!name) {
        return res.status(400).json({
          code: 400,
          msg: "Thiếu tham số tìm kiếm 'name'",
          data: null,
        });
      }
  
      // Sử dụng biểu thức chính quy để tìm kiếm không phân biệt chữ hoa chữ thường
      const regex = new RegExp(name, "i");
      const products = await Product.find({ name: regex });
  
      return res.json({
        code: 200,
        msg: "Tìm kiếm sản phẩm thành công",
        data: products,
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        msg: error.message,
        data: null,
      });
    }
  };

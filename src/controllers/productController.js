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

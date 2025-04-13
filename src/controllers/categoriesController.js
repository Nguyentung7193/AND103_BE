const Category = require('../models/categories');

// Tạo mới một category
exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    return res.json({
        code: 200,
        msg: "Lấy danh sách category thành công",
        data: category,
      });
  } catch (error) {
    return res.status(400).json({
        code: 400,
        msg: error.message,
        data: null,
      });
  }
};
// Lấy danh sách tất cả các category
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
        code: 200,
        msg: "Lấy danh sách category thành công",
        data: categories,
      });
  } catch (error) {
    res.status(500).json({
        code: 500,
        msg: error.message,
        data: null,
      });
  }
};

// Lấy thông tin một category theo ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
    res.status(404).json({
        code: 404,
        msg: "Không tìm thấy sản phẩm",
        data: null,
      });
    }
    res.status(200).json({
      code: 200,
      msg: "Lấy thông tin sản phẩm thành công",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: error.message,
      data: null,
    });
  }
};

// Cập nhật một category theo ID
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!category) {
    return res.status(404).json({
        code: 404,
        msg: "Không tìm thấy sản phẩm",
        data: null,
      });
    }
   res.status(200).json({
        code: 200,
        msg: "Cập nhật sản phẩm thành công",
        data: category,
      });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: error.message,
      data: null,
    });
  }
};

// Xóa một category theo ID
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
     return res.status(404).json({ message: 'Không tìm thấy category để xóa' });
    }
    res.status(200).json({
      code: 200,
      msg: "Xóa sản phẩm thành công",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: error.message,
      data: null,
    });
  }
};

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoriesController');

// Route để tạo mới category
router.post('/create', categoryController.createCategory);

// Route để lấy danh sách tất cả các category
router.get('/', categoryController.getAllCategories);

// Route để lấy thông tin một category theo ID
router.get('/getCate/:id', categoryController.getCategoryById);

// Route để cập nhật category theo ID
router.put('/update/:id', categoryController.updateCategory);

// Route để xóa category theo ID
router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router;

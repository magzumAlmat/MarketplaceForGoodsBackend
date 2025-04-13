// src/routes/index.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { upload } = require('./utils');

// Контрлеры
const {
  createProduct,
  getAllProducts,
  getProductById,
  editProduct,
  deleteProductById,
} = require('../controllers/productContoller'); // Исправлено: productContoller -> productController
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  editCategory,
  deleteCategoryById,
} = require('../controllers/categoryController');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  editOrder,
  deleteOrderById,
} = require('../controllers/orderController');
const { doLogin } = require('../controllers/authController');

// Middleware для проверки роли администратора (пример, реализуй в зависимости от твоей логики)
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Доступ запрещён: требуется роль администратора' });
};

// Аутентификация
router.post('/api/store/login', doLogin);

// Продукты (Product) - CRUD
router.get('/api/store/products', getAllProducts); // Получить все продукты (доступно всем)
router.get('/api/store/products/:id', getProductById); // Получить продукт по ID (доступно всем)
router.post(
  '/api/store/products',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  upload.array('image', 5),
  createProduct
); // Создать продукт (только админ)
router.put(
  '/api/store/products/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  upload.array('image', 5),
  editProduct
); // Обновить продукт (только админ)
router.delete(
  '/api/store/products/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  deleteProductById
); // Удалить продукт (только админ)

// Категории (Category) - CRUD
router.get('/api/store/categories', getAllCategories); // Получить все категории (доступно всем)
router.get('/api/store/categories/:id', getCategoryById); // Получить категорию по ID (доступно всем)
router.post(
  '/api/store/categories',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  createCategory
); // Создать категорию (только админ)
router.put(
  '/api/store/categories/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  editCategory
); // Обновить категорию (только админ)
router.delete(
  '/api/store/categories/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  deleteCategoryById
); // Удалить категорию (только админ)

// Заказы (Order) - CRUD
router.get(
  '/api/store/orders',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  getAllOrders
); // Получить все заказы (только админ)
router.get(
  '/api/store/orders/:id',
  passport.authenticate('jwt', { session: false }),
  getOrderById
); // Получить заказ по ID (доступно пользователю, если заказ его)
router.post(
  '/api/store/orders',
  passport.authenticate('jwt', { session: false }),
  createOrder
); // Создать заказ (доступно аутентифицированным пользователям)
router.put(
  '/api/store/orders/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  editOrder
); // Обновить заказ (только админ)
router.delete(
  '/api/store/orders/:id',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  deleteOrderById
); // Удалить заказ (только админ)

module.exports = router;
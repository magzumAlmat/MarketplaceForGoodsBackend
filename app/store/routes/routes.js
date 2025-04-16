const express=require('express')
const router=express.Router()
const {createProduct, getAllProducts, getProductById, deleteProduct, updateProduct} = require('../controllers/productContoller')
const {createOrder, getAllOrders, getOrderById, editOrder,deleteOrderById} = require('../controllers/orderController')
const {doLogin} = require("../controllers/authController");
const passport = require('passport');





const {
    uploadProductImage,
    listProductImages,
    getProductImageById,
    updateProductImage,
    deleteProductImage,
  } = require("../controllers/productImageController");
  const upload = require("../routes/utils");
  





const {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");


// const createOrder = require('../controllers/orderController');

router.post('/api/store/orders', createOrder);


    router.post("/api/store/categories", createCategory);
    router.get("/api/store/getallcategories", listCategories);
    router.get("/api/store/categories/:id", getCategoryById);
    router.put("/api/store/categories/:id", updateCategory);
    router.delete("/api/store/categories/:id", deleteCategory);


  router.post("/api/store/product-images", upload.array('image',5), uploadProductImage);
  router.get("/api/store/product-images/product/:productId", listProductImages);
  router.get("/api/store/product-images/:id", getProductImageById);
  router.put("/api/store/product-images/:id", updateProductImage);
  router.delete("/api/store/product-images/:id", deleteProductImage);

// router.post('/api/resume', passport.authenticate('jwt', {session: false}), isEmployee,validateResume, createResume)
router.get('/api/store/allproducts', getAllProducts);
router.get('/api/store/product/:id', getProductById);

router.get('/api/store/order/:id', getOrderById);
router.get('/api/store/allorders', getAllOrders);
router.post('/api/store/createproduct',upload.array('image',5), createProduct);
router.delete('/api/store/product/:id', deleteProduct);
router.delete('/api/store/order/:id', deleteOrderById);
router.put('/api/store/product/:id', upload.array('image',5), updateProduct);

router.post('/api/store/createorder', createOrder);
router.post('/api/store/order/:id/editorder', editOrder);

router.post('/api/store/login', doLogin);

module.exports = router;
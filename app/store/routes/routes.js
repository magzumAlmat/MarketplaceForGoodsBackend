const express=require('express')
const router=express.Router()
const {createProduct, getAllProducts, getProductById, deleteProductById, editProduct} = require('../controllers/productContoller')
const {createOrder, getAllOrders, getOrderById, editOrder,deleteOrderById} = require('../controllers/orderController')
const {doLogin} = require("../controllers/authController");
const passport = require('passport');
const {upload} = require("./utils");
const ProductController=require('../controllers/productContoller')



router.get('/', ProductController.getAllProducts);
router.post('/', ProductController.createProduct);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

// router.post('/api/resume', passport.authenticate('jwt', {session: false}), isEmployee,validateResume, createResume)
router.get('/api/store/allproducts', getAllProducts);
router.get('/api/store/product/:id', getProductById);

router.get('/api/store/order/:id', getOrderById);
router.get('/api/store/allorders', getAllOrders);
router.post('/api/store/createproduct',upload.array('image',5), createProduct);
router.delete('/api/store/product/:id', deleteProductById);
router.delete('/api/store/order/:id', deleteOrderById);
router.put('/api/store/product/:id', upload.array('image',5), editProduct);
router.post('/api/store/createorder', createOrder);
router.post('/api/store/order/:id/editorder', editOrder);

router.post('/api/store/login', doLogin);

module.exports = router;
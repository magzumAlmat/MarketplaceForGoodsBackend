const express=require('express')
const router=express.Router()
const {createProduct, getAllProducts, getProductById, deleteProduct, updateProduct} = require('../controllers/productContoller')
const {createOrder, getAllOrders, getOrderById, editOrder,deleteOrderById} = require('../controllers/orderController')
const {doLogin} = require("../controllers/authController");
const passport = require('passport');
const {upload} = require("./utils");






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
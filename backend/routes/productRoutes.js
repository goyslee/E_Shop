// routes\productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const isAuthorised = require('../middleware/isAuthorised'); 
const isAuthenticated = require('../middleware/isAuthenticated');

router.post('/products',isAuthenticated, productController.addProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/:productid', productController.getProductById);
router.put('/products/:productid',isAuthenticated, productController.updateProduct);
router.delete('/products/:productid',isAuthenticated, productController.deleteProduct);

module.exports = router;


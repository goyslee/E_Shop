// routes\cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const isAuthenticated = require('../middleware/isAuthenticated');

router.post('/cart/add',isAuthenticated, cartController.addItemToCart);
router.put('/cart/:itemId',isAuthenticated, cartController.updateCartItem);
router.delete('/cart/:itemId', cartController.deleteCartItem);
router.get('/cart', isAuthenticated, cartController.showCart);
router.get('/cart/quantity/:productid', isAuthenticated, cartController.getCartItemQuantity);


module.exports = router;

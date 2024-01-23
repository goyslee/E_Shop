// routes\cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthorised = require('../middleware/isAuthorised');

router.post('/cart/add', cartController.addItemToCart);
router.put('/cart/:itemId', cartController.updateCartItem);
router.delete('/cart/:itemId', cartController.deleteCartItem);
router.delete('/cart/removeAll/:productId', cartController.deleteAllOfItem);
router.get('/cart', cartController.showCart);
router.get('/cart/quantity/:productid', cartController.getCartItemQuantity);


module.exports = router;

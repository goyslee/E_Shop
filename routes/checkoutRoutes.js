// routes\checkoutRoutes.js
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const isAuthenticated = require('../middleware/isAuthenticated');

router.post('/cart/:cartId/checkout', isAuthenticated,  checkoutController.checkout);

module.exports = router;

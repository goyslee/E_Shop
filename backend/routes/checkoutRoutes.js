// routes\checkoutRoutes.js
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthorised = require('../middleware/isAuthorised');

router.post('/:userid/checkout', checkoutController.checkout);

module.exports = router;

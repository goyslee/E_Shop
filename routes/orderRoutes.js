//routes\orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthorised = require('../middleware/isAuthorised');

router.get('/orders', orderController.getAllOrders);
router.get('/orders/:orderId', orderController.getOrderById);
router.post('/orders', orderController.createOrder);
router.put('/orders/:orderId/orderdetails/:orderDetailId', orderController.updateOrderDetails);
router.delete('/orders/:orderId', orderController.deleteOrder);

module.exports = router;

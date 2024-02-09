//routes\orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthorised = require('../middleware/isAuthorised');

router.get('/orders',isAuthenticated, orderController.getAllOrders);
router.get('/orders/:orderId',isAuthenticated, orderController.getOrderById);
router.post('/orders',isAuthenticated, orderController.createOrder);
router.put('/orders/:orderId/orderdetails/:orderDetailId',isAuthenticated, orderController.updateOrderDetails);
router.delete('/orders/:orderId',isAuthenticated, orderController.deleteOrder);

module.exports = router;

// routes\userRoutes.js 
const express = require('express');
const userController = require('../controllers/userController');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();

router.post('/register', userController.register);
router.get('/users/:userid',isAuthenticated, userController.getUserById);
router.put('/users/:userid', userController.updateUser);
router.delete('/users/:userid', userController.deleteUser);

module.exports = router;

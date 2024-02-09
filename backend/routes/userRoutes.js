// routes\userRoutes.js 
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthorised = require('../middleware/isAuthorised');


router.post('/register', userController.register);
router.get('/users/:userid',isAuthenticated,  userController.getUserById);
router.get('/users/user-profile/:userid',isAuthenticated, userController.getUserById);
router.put('/users/:userid',isAuthenticated, userController.updateUser);
router.delete('/users/:userid',isAuthenticated, userController.deleteUser);
router.get('/check-auth',isAuthenticated, userController.checkAuth);

module.exports = router;

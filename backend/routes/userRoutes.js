// routes\userRoutes.js 
const express = require('express');
const userController = require('../controllers/userController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthorised = require('../middleware/isAuthorised');
const router = express.Router();

router.post('/register', userController.register);
router.get('/users/:userid', userController.getUserById);
router.get('/users/user-profile/:userid', userController.getUserById);
router.put('/users/:userid', userController.updateUser);
router.delete('/users/:userid', userController.deleteUser);
router.get('/check-auth', userController.checkAuth);

module.exports = router;

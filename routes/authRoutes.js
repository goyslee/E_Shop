const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthorised = require('../middleware/isAuthorised');

router.post('/login', authController.login(passport));
router.post('/logout', isAuthenticated, authController.logout);
router.get('/logoutPage', authController.logoutPage);

module.exports = router;

const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.post('/login', authController.login(passport));
router.post('/logout', authController.logout);
router.get('/logoutPage', authController.logoutPage);

module.exports = router;

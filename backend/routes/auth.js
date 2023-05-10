const express = require('express');
const authController = require('../controllers/auth');
const isAuth = require('../middlewares/is-auth');
const router = express.Router();

router.post('/register',authController.postRegister);

router.post('/login',authController.postLogin);

router.post('/reset', authController.postReset);

router.post('/reset-pass', authController.resetPassword);

router.post('/address',isAuth,authController.postAddress);


module.exports = router;
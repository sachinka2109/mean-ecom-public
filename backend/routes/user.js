const express = require('express');
const userController = require('../controllers/user');
const isAuth = require('../middlewares/is-auth');
const router = express.Router();

router.get('/profile',isAuth, userController.getProfile);

router.post('/update',isAuth, userController.updateProfile);

router.get('/order',isAuth,userController.getOrder);

router.get('/order-detail/:id',isAuth,userController.getSingleOrder);

router.post('/order-detail/:id',isAuth,userController.postDeleteOrder);

router.post('/become-seller',isAuth,userController.becomeSeller);

module.exports = router;
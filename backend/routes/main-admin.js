const express = require('express');
const router = express.Router();
const mainAdminController = require('../controllers/main-admin');
const isAuth = require('../middlewares/is-auth');
const isAdmin = require('../middlewares/is-admin');

router.get('/orders', isAuth,isAdmin, mainAdminController.getAllOrders);

router.get('/users',isAuth,isAdmin, mainAdminController.getAllUsers);

router.post('/status', isAuth,isAdmin, mainAdminController.statusChange);

router.post('/item-status', isAuth,isAdmin, mainAdminController.itemStatusChange);

router.post('/toggle-feature',isAuth,isAdmin, mainAdminController.toggleFeature);

router.post('/delete-order',isAuth,isAdmin, mainAdminController.deleteOrder);

router.post('/make-admin',isAuth,isAdmin, mainAdminController.makeAdmin);

router.post('/ban-user', isAuth,isAdmin, mainAdminController.postBanUser);

router.post('/delete-user', isAuth,isAdmin, mainAdminController.postDeleteUser);


module.exports = router;
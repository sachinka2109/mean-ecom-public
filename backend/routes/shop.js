const express = require('express');
const shopController = require('../controllers/shop');
const isAuth = require('../middlewares/is-auth');
const router = express.Router();


router.get('/products' , shopController.getAllProducts);

router.get('/new-products',shopController.getNewProducts);

router.get('/featured-products',shopController.getFeaturedProducts)

router.get('/todays-deal',shopController.getTodaysDeal)

router.get('/categories',shopController.getAllCategories);

router.get('/categories/:id' ,shopController.getCategoryProducts);

router.get('/product-detail/:id', shopController.getSingleProduct);

router.post('/rate-product',isAuth,shopController.postRating);

router.get('/cart', isAuth ,shopController.getAddToCart);

router.post('/cart', isAuth ,shopController.postAddToCart);

router.post('/cart/update',isAuth,shopController.updateAddToCart);

router.post('/cart/delete',isAuth ,shopController.removeCartItem);

router.post('/cart/clear',isAuth ,shopController.clearCart);

router.get('/checkout',isAuth,shopController.getCheckout);

router.post('/order/:token',isAuth, shopController.postOrder);

module.exports = router;
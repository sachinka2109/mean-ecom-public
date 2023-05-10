const Product = require('../models/product');
const User = require('../models/user');
const mongoose = require('mongoose');
// const io = require('../socket');
const Category = require('../models/categories');
const Order = require('../models/order');
const Reviews = require('../models/reviews');
const config = require('../config');
const reviews = require('../models/reviews');
const stripe = require('stripe')(config.stripePrivate);
const crypto = require('crypto');

async function generateToken() {
    const buffer = crypto.randomBytes(32);
    return buffer.toString('hex');
}
let success_token;

exports.getAllProducts = async (req, res, next) => {
    let totalproducts
    const page = +req.query.page || 1;
    const pageSize = +req.query.pagesize || 6;
    try{
        const products = await Product.find().countDocuments().sort({createdAt: -1})
        totalproducts = products
        const perproducts = await Product.find().sort({createdAt: -1}).populate({path:'reviews',populate: {path: 'owner'}})
        .skip(pageSize * (page-1))
        .limit(pageSize)
        let productRating = perproducts.map(product => {
            return product.averageRating;
        })
        res.status(200).json({
            success: true,
            products: perproducts,
            totalproducts: totalproducts,
            productRating:productRating,
            pages: Math.ceil(totalproducts/ pageSize)
        })
    }
    catch(error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

// const ITEMS_PER_PAGE = 2;
exports.getNewProducts = async (req,res,next) => {
    let totalproducts
    const page = +req.query.page || 1;
    const pageSize = 4;
    try{
        const products = await Product.find().countDocuments().sort({createdAt: -1}).limit(10)
        totalproducts = products
        const perproducts = await Product.find().sort({createdAt: -1}).populate({path:'reviews',populate: {path: 'owner'}})
        .skip(pageSize * (page-1))
        .limit(pageSize)
        let productRating = perproducts.map(product => {
            return product.averageRating;
        })
        res.status(200).json({
            success: true,
            products: perproducts,
            totalproducts: totalproducts,
            productRating:productRating,
            pages: Math.ceil(totalproducts/ pageSize)
        })
    }
    catch(error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getFeaturedProducts = async(req,res,next) => {
    let totalproducts
    const page = +req.query.page || 1;
    const pageSize = 4;
    try{
        const products = await Product.find({isFeatured:true}).countDocuments().sort({createdAt: -1}).limit(10)
        totalproducts = products
        const perproducts = await Product.find({isFeatured:true}).sort({createdAt: -1})
        .populate({path:'reviews',populate: {path: 'owner'}})
        .skip(pageSize * (page-1))
        .limit(pageSize)
        let productRating = perproducts.map(product => {
            return product.averageRating;
        })
        res.status(200).json({
            success: true,
            products: perproducts,
            totalproducts: totalproducts,
            productRating:productRating,
            pages: Math.ceil(totalproducts/ pageSize)
        })
    }
    catch(error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}
exports.getTodaysDeal = async(req,res,next) => {
    let totalproducts
    const page = +req.query.page || 1;
    const pageSize = 4;
    try{
        const products = await Product.find({ discount: { $gt: 0 } }).countDocuments().sort({createdAt: -1})
        totalproducts = products
        const perproducts = await Product.find({ discount: { $gt: 0 } }).sort({createdAt: -1}).populate({path:'reviews',populate: {path: 'owner'}})
        .skip(pageSize * (page-1))
        .limit(pageSize)
        let productRating = perproducts.map(product => {
            return product.averageRating;
        })
        res.status(200).json({
            success: true,
            products: perproducts,
            totalproducts: totalproducts,
            productRating:productRating,
            pages: Math.ceil(totalproducts/ pageSize)
        })
    }
    catch(error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getAllCategories = async (req,res,next) => {
    try{
      const categories = await Category
      .find()
      .sort({ firstName: 1 })
      .collation({ locale: "en", caseLevel: true })
      res.status(200).json({
        categories: categories
      })
    }
    catch(error) {
      if(!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
}

exports.getCategoryProducts = async (req,res,next) => {
    let totalproducts;
    const page = +req.query.page || 1;
    const pageSize = +req.query.pagesize || 6;
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        const products = await Product.find({category: category.name}).countDocuments().sort({createdAt: -1})
        totalproducts = products
        const perproducts = await Product.find({category: category.name}).sort({createdAt: -1}).populate({path:'reviews',populate: {path: 'owner'}})
        .skip(pageSize * (page-1))
        .limit(pageSize)
        let productRating = perproducts.map(product => {
            return product.averageRating;
        })
        res.status(200).json({
            success: true,
            products: perproducts,
            totalproducts: totalproducts,
            productRating:productRating,
            pages: Math.ceil(totalproducts/ pageSize)
        })
    }
    catch(error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getSingleProduct = async (req, res,next) => {
    const prodId = req.params.id
    try {
        const product = await Product.findById(prodId)
        .populate({path:'reviews',populate: {path: 'owner'}})
        const productRating = product.averageRating;
        // console.log(productRating)
        if(!product) {
            // const error = new Error('No such product found')
            // error.statusCode = 404;
            // throw error;
            return res.status(404).json({
                success: false,
                message: 'No such product found'
            })  
        }
        res.status(200).json({
            success: true,
            product:product,
            productRating:productRating
        })
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.postRating = async(req,res,next) => {
    const prodId = req.body.prodId;
    const rating = req.body.rating;
    const title = req.body.ratingForm.title;
    const description = req.body.ratingForm.description;
    try {
        const product = await Product.findById(prodId);
        let review = new Reviews({
            owner: req.userId,
            productId: prodId,
            title: title,
            description: description,
            rating: rating
        })
        product.reviews.push(review._id);
        await product.save();
        await review.save();
        res.status(200).json({
            success: true,
            message:'Rating added successfully'
        })
    }
    catch(error){
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getAddToCart = async (req,res,next) => {
    try{
        const userId = req.userId;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        }
        userCart = await user.populate('cart.items.productId')
        const products = user.cart.items;
        // console.log(products.length)
        total = 0;
        // if(products.length <= 0) {
        //     res.status(404).json({
        //         success: false,
        //         message: 'No Products were found in your cart'
        //     })
        // }
        if(products.length > 0){
            products.forEach(p => {
                total += p.quantity * (p.productId.discount? p.productId.discount : p.productId.price);
            });
        } 
        // console.log(total);
        res.status(200).json({
            success: true,
            products: products,
            total: total
        });
    }
    catch(error){
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.updateAddToCart = async (req,res,next) => {
    const userId = req.userId;
    const prodId = req.body.prodId;
    const quantity = req.body.quantity;
    // console.log(quantity)
    try {
        const user = await User.findById(userId)
        const product = await Product.findById(prodId)
        // console.log(product.quantity)
        if(quantity > product.quantity) {
           return res.status(416).json({
                success:false,
                message: 'The Product exceeded its quantity'
           })
        } 
        await user.updateCart(prodId,quantity)
        res.status(200).json({
            success: true,
        })      
    }
    catch(error){
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.postAddToCart = async (req, res, next) => {
    const userId = req.userId;
    const prodId = req.body.prodId;
    // console.log(userId, prodId);
    try {
        const product = await Product.findById(prodId); 
        const user = await User.findById(userId);
        await user.addToCart(product)
        res.status(200).json({
            success: true,
            message: 'Product added to cart successfully',
            product:product
        })
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
          }
        next(error);
    }
}

exports.removeCartItem = async(req, res, next) => {
    const userId = req.userId;
    const prodId = req.body.prodId;
    // console.log(prodId);
    try {
        const user = await User.findById(userId);
        const result = await user.removeFromCart(prodId)
        res.status(200).json({
            success: true,
            message: 'Item removed successfully'
        })
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
          }
        next(error);
    }
}

exports.clearCart = async (req,res,next) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        const result = await user.clearCart()
        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
        });
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
          }
        next(error);
    }
}

exports.getCheckout = async(req,res,next) => {
    let products
    let total = 0;
    success_token = await generateToken();
    try{
        const user = await User.findById(req.userId);
        await user.populate('cart.items.productId')    
        products = user.cart.items;
        total = 0;
        products.forEach(p => {
        total += p.quantity * p.productId.price;
        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: products.map(p => {
                return {
                price_data:{
                    unit_amount: (p.productId.discount > 0?p.productId.discount : p.productId.price) * 100,
                    currency: 'inr',
                    product_data:{
                    name: p.productId.title,
                    description: p.productId.description
                    },
                },
                quantity: p.quantity
                };
            }),
            success_url: `http://localhost:4200/checkout/success/${success_token}` , // => http://localhost:3000
            cancel_url: 'http://localhost:4200/checkout'  
        })
        res.status(200).json({
            products: products,
            totalSum: total,
            sessionId: session.id,
        })
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.postOrder = async(req,res,next)=>{
    const userId = req.userId;
    const user = await User.findById(userId);
    try {
        if(success_token === req.params.token){
            await user.populate('cart.items.productId')
            const products = user.cart.items.map(i => {
                // console.log(i)
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            if(products.length <= 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No Products were found in your cart',
                })
            }
            const order = new Order({
                user: {
                    email: user.email,
                    userId: userId
                },
                products: products,
                status: 'Pending'
            }); 
            await order.save();
            await user.clearCart();
            products.forEach((p) => {
                Product.updateOne(
                {_id: p.product._id},
                {$inc: {quantity: -p.quantity}},
                ).exec()
            })
            res.status(200).json({
                success: true,
                message: 'Congratulations! You have successfully placed your order'
            })
            success_token = null;
        } else {
            res.status(403).json({
                success: false,
                message: 'You Have not done the payment yet'
            })
        }
    }
    
    catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

// exports.postOrder = async(req, res, next) => {
//     const userId = req.userId
//     const user = await User.findById(userId);
//     try {
//         await user.populate('cart.items.productId')
//         const products = user.cart.items.map(i => {
//             return { quantity: i.quantity, product: { ...i.productId._doc } };
//         });
//         if(products.length <= 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No Products were found in your cart',
//             })
//         }
//         const order = new Order({
//             user: {
//                 email: user.email,
//                 userId: userId
//             },
//             products: products
//         });
//         await order.save();
//         await user.clearCart();
//         res.status(200).json({
//             success: true,
//             message: 'Congratulations! You have successfully placed your order'
//         })
//     }
//     catch(error){
//         if(!error.statusCode){
//             error.statusCode = 500;
//           }
//         next(error);
//     }
// }


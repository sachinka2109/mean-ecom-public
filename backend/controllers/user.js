const User = require('../models/user');
const Order = require('../models/order');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// var transport = nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: "1932437b8ea4b9",
//       pass: "89b78dd489708c"
//     }
// });

exports.getProfile =  async(req, res, next) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        res.status(200).json({
            success: true,
            username: user.name,
            userpicture: user.picture,
            useremail: user.email,
            userphone: user.phone,
            useraddress: user.address
        })
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    } 
};

exports.updateProfile = async(req, res, next) => {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const phone = req.body.phone;
    const add1 = req.body.add1;
    const add2 = req.body.add2;
    const country = req.body.country;
    const state = req.body.state;
    const city = req.body.city;
    const pin = req.body.pin;
    // console.log(add1,add2,country,state,city,pin);
    try {
        const user = await User.findById(req.userId);
        user.name = fullname,
        user.email = email,
        user.phone = phone,
        user.address.add1 = add1,
        user.address.add2 = add2,
        user.address.country = country,
        user.address.state = state,
        user.address.city = city,
        user.address.postalCode = pin
        await user.save()
        res.status(200).json({
            success: true,
            message: 'User updated successfully'
        })
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.getOrder = async(req, res, next) => {
    const userId = req.userId;
    try {
        const orders = await Order.find({'user.userId' : userId}).sort({createdAt: -1})
        res.status(200).json({
            success: true,
            orders:orders
        })
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getSingleOrder = async(req,res,next) => {
    const id = req.params.id;
    let total = 0;
    try {
        const order = await Order.findOne({_id: id}).populate({path: 'user.userId'})
        let products = order.products
        if(products.length > 0){
            products.map(products => {
                total += products.quantity * (products.product.discount > 0?products.product.discount :products.product.price);
            })
            res.status(200).json({
                order:order,
                total:total
            })
        }
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.postDeleteOrder = async (req, res, next) => {
    const id = req.params.id;
    try {
        await Order.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Your order has been Cancelled'
        })
    }
    catch(error){
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.becomeSeller = async(req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if(user.isSeller === true) {
            res.status(409).json({
                success:false,
                message: 'Your account is already a Seller'
            })
        }
        await user.updateOne({isSeller:true})
        res.status(200).json({
            success:true,
            messsage: 'Your account has become a Seller'
        })
    }
    catch(error){
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}
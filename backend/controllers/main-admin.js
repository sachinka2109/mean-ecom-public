const mongoose = require('mongoose');
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const Reviews = require('../models/reviews');

exports.getAllOrders = async(req,res,next) => {
    let totalorders;
    let total = [];
    const page = +req.query.page || 1;
    const pageSize = +req.query.pagesize || 5;
    try{
        const orders = await Order.find().countDocuments().sort({createdAt: -1})
        totalorders = orders
        const perorders = await Order.find().sort({createdAt: -1}).populate({path:'user.userId'})
        .skip(pageSize * (page-1))
        .limit(pageSize)
        total = perorders.map(orders => {
            return orders.products.map(product => {
                if(product.product.discount > 0){
                    return (product.product.discount * product.quantity)
                } else {
                    return (product.product.price * product.quantity)
                }
            })
        })
        total = total.map(innerArr => innerArr.reduce((acc, curr) => acc + curr, 0));
        res.status(200).json({
            success: true,
            orders: perorders,
            totalorders: totalorders,
            total:total,
            pages: Math.ceil(totalorders/ pageSize)
        })
    }
    catch(error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}


exports.getAllUsers = async(req,res,next) => {
    let totalusers;
    const page = +req.query.page || 1;
    const pageSize = +req.query.pagesize || 5;
    try{
        const users = await User.find().countDocuments().sort({createdAt: -1})
        totalusers = users
        const perusers = await User.find().sort({createdAt: -1})
        .skip(pageSize * (page-1))
        .limit(pageSize)
        res.status(200).json({
            success: true,
            users: perusers,
            totalusers: totalusers,
            pages: Math.ceil(totalusers/ pageSize)
        })
    }
    catch(error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}


exports.statusChange = async(req,res,next) => {
    const user = await User.findOne({_id: req.userId});
    const order = await Order.findOne({_id:req.body.id})
    console.log(order)
    const status = req.body.status;
    try{
        if(user.admin === true){
            order.status = status;
            await order.save();
            res.status(200).json({
                success: true,
                message: `Status changed to ${status}`
            })
        } else {
            res.status(403).json({
                success: false,
                message: 'Only admins can change status of Order'
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


exports.itemStatusChange = async(req,res,next) => {
    const user = await User.findOne({_id: req.userId});
    const status = req.body.status;
    console.log(req.body.prodId)
    try{
        if(user.admin === true){
            await Order.updateOne({ 'products._id': req.body.prodId },{ $set: { 'products.$.status': status } })
            res.status(200).json({
                success: true,
                message: `Status changed to ${status}`
            })
        } else {
            res.status(403).json({
                success: false,
                message: 'Only admins can change status of Order'
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


exports.toggleFeature = async(req,res,next) => {
    const prodId = req.body.id;
    const product = await Product.findOne({_id: prodId});
    const user = await User.findOne({_id: req.userId});
    try {
        if(user.admin === true){
            if(product){
                product.isFeatured = !product.isFeatured;
                await product.save();
                res.status(200).json({
                    success: true,
                    message: 'Product updated successfully'
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Product was not found'
                })
            }
        }
    }
    catch(error) {
        if(!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
    }
}


exports.deleteOrder = async(req,res,next) => {
    const id = req.query.id;
    const user = await User.findOne({_id:req.userId});
    try {
        if(user.admin === true) {
            await Order.findByIdAndDelete(id);
            res.status(200).json({
                success: true,
                message: 'The order was successfully removed'
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

exports.makeAdmin = async(req,res,next) => {
    const user = await User.findOne({_id:req.body.id});
    try {
        if(user.admin === true && (req.userId !== req.body.id)) {
            user.admin = !user.admin;
            await user.save();
            res.status(200).json({
                success: true,
                message: 'User Updated successfully'
            })
        } else {
            res.status(403).json({
                success: false,
                message: 'Who will take care of the website then?'
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


exports.postBanUser = async(req,res,next) => {
    const banuser = await User.findOne({_id:req.query.id});
    const user = await User.findOne({_id:req.userId});
    try {
        if(user.admin === true) {
            if(user._id.toString() !== banuser._id.toString()){
                banuser.banned = !banuser.banned;
                await banuser.save();
                res.status(200).json({
                    success: true,
                    message: 'User Updated successfully'
                })
            } else {
                res.status(403).json({
                    success: false,
                    message: 'Do you wanna Ban Yourself?😜😜'
                }) 
            }
        } else {
            res.status(403).json({
                success: false,
                message: 'Only Admins Can Have this Permission'
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


exports.postDeleteUser = async(req,res,next) => {
    const deleteUser = await User.findOne({_id:req.query.id});
    const user = await User.findOne({_id:req.userId});
    try {
        if((user._id.toString() !== deleteUser._id.toString()) && user.admin === true) {
            await Product.deleteMany({owner: req.query.id});
            await Reviews.deleteMany({owner: req.query.id});
            await User.deleteOne({_id: req.query.id});
            res.status(200).json({
                success: true,
                message: 'User Removed successfully'
            })
        } else {
            res.status(403).json({
                success: false,
                message: 'You cannot remove this user as user is Admin'
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


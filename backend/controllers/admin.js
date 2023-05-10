const Product = require('../models/product');
const User = require('../models/user');
const Category = require('../models/categories');
const Reviews = require('../models/reviews');
const mongoose = require('mongoose');
const io = require('../socket');
const config = require('../config');
const aws = require('aws-sdk');

const s3 = new aws.S3({
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_KEY,
});


exports.getAdminProducts = async (req,res, next)=> {
  let totalproducts;
  const page = +req.query.page || 1;
  const pageSize = +req.query.pagesize || 5;
  const userId = req.userId;
  try {
    const products = await Product.find({owner:userId}).countDocuments()
    .sort({createdAt: -1})
    totalproducts = products
    const perproducts = await Product.find({owner:userId})
    .skip(pageSize * (page-1))
    .limit(pageSize)
    .sort({createdAt: -1})
    res.status(200).json({
      success: true,
      products: perproducts,
      totalproducts: totalproducts,
    });
  }
  catch(error) {
    if(!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

exports.postAddAdminProducts = async (req, res,next) => {
  const user = await User.findOne({_id:req.userId})
  const userId = req.userId;
  const title = req.body.title;
  const brand = req.body.brand;
  const description = req.body.description;
  let category = req.body.category;
  let subCategory = req.body.subCategory;
  const quantity = req.body.quantity;
  const price = req.body.price;
  const discount = req.body.discount;
  category = category.toString().toLowerCase();
  subCategory = subCategory.toString().toLowerCase();
  try {
    if(user.admin === false || user.isSeller === false) {
      return res.status(403).json({
        success:false,
        message: 'You must be a seller or admin to Add a Product'
      })
    }
    const categorydb = await Category.findOne({name: category})
    if(categorydb == null) {
      const newCategory = new Category({
        name: category,
        subCategories: {subCategory:{name: subCategory}},
      });
      await newCategory.save();
    } else {
      await categorydb.insertSubcategory(subCategory)
    }
    const product = new Product({
      owner: userId,
      title: title,
      brand:brand,
      imageUrl:  req.file.location,
      description: description,
      category: category,
      subCategory: subCategory,
      quantity: quantity,
      isFeatured: false,
      price: price,
      discount: discount
    })
    const result = await product.save();
    io.getIO().emit('product', {
      action: 'create',
      product: { result }
    });
    res.status(200).json({
      success:true,
      message: 'Product created successfully',
      product:result
    })
  }
  catch(error) {
    if(!error.statusCode) {
        error.statusCode = 500;
    }
    next(error);
  }
}

exports.getSingleProduct = async (req,res,next) =>{
  const user = await User.findOne({_id:req.userId});
  const prodId = req.params.id;
  try{
    if(user.admin === true || user.isSeller === true){
      const product = await Product.findById(prodId)
      if(!product){
        return res.status(404).json({
          success: false,
          message: 'No product found'
        })  
      }
      res.status(200).json({
        success: true,
        product: product
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

exports.postEditProduct = async (req,res,next) =>{
    const prodId = req.params.id;
    const title = req.body.title;
    const brand = req.body.brand;
    const description = req.body.description;
    const quantity = req.body.quantity;
    const price = req.body.price;
    const discount = req.body.discount;
    const userId = req.userId;
    const user = await User.findOne({_id: userId})
    try {
      const product = await Product.findById(prodId)
      if(!product){
        return res.status(404).json({
          success: false,
          message: 'No such product found'
        })  
      }
      if((userId.toString() !== product.owner.toString()) || user.admin === false) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized User aren\'t allowed to edit this product'
        })  
      }
      product.title = title;
      product.brand = brand;
      if(req.body.imageUrl){
        product.imageUrl = req.body.imageUrl;
      } else {
        s3.deleteObject({
          Bucket: 'meanstack2109',
          Key: product.imageUrl.split("/").slice(-1)[0],
        }).promise()
        product.imageUrl =  req.file.location;
      }
      product.description = description;
      product.quantity = quantity;
      product.price = price;
      product.discount = discount;
      const result = await product.save()
      io.getIO().emit('product', {
        action: 'update',
        product: { result }
      });
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product: result
      })
    }
    catch(error) { 
      if(!error.statusCode) {
          error.statusCode = 500;
      }
      next(error);
    }
}

exports.postDeleteProduct = async (req,res,next)=>{
  const prodId = req.params.id;
  const userId = req.userId;
  const checkUser = await User.findById(req.userId);
  try {
    const product = await Product.findById(prodId)
    if(!product) {
      return res.status(404).json({
        success: false,
        message: 'The product you requested was not found or might already be deleted'
      })   
    }
    if(userId !== product.owner.toString() || checkUser.admin === false){
      return res.status(403).json({
        success: false,
        message: 'Unauthorized user aren\'t allowed to delete product'
      })  
    }
    console.log(product.imageUrl.split("/").slice(-1)[0])
    s3.deleteObject({
      Bucket: 'meanstack2109',
      Key: product.imageUrl.split("/").slice(-1)[0],
    }).promise()
    const result = await Product.findByIdAndDelete(prodId)
    const user = await User.find({'cart.items.productId': prodId})
    user.forEach(user => {
      user.removeFromCart(prodId);
    })
    await Reviews.deleteMany({productId: prodId});
    io.getIO().emit('product', {
      action: 'delete',
      product: { result }
    });
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    })
  }
  catch(error) {
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  }
}
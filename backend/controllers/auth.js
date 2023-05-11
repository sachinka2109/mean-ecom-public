const crypto = require('crypto');
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const config = require('../config');


// var transport = nodemailer.createTransport({
//     host: config.HOST,
//     port: config.MAIL_PORT,
//     auth: {
//       user: config.AUTH.USER,
//       pass: config.AUTH.PASS,
//     }
// });

exports.postRegister = async (req, res, next) => {
    let email = req.body.email;
    let name = req.body.name;
    let phone = req.body.phone;
    let password = req.body.password;
    try {
        const existingUser = await User.findOne({email:email})
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: 'A User with this email already exists'
            })  
        }
        const hashPassword = await bcrypt.hash(password,12)
        const user = new User({
            email: email,
            name: name,
            phone: phone,
            password: hashPassword,
            isSeller: false,
            cart: { items: [] }
        })
        user.picture = user.gravatar()
        await user.save();
        // transport.sendMail({
        //     to: email,
        //     from: 'shop@node-complete.com',
        //     subject: 'Signup succeeded!',
        //     html: '<h1>You successfully signed up!</h1>'
        // });
        res.status(201).json({   
            success: true,
            message: 'User Registered successfully'
        })
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.postLogin = async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User does not exist",
        });
      }
  
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if (err || !passwordMatch) {
          return res.status(401).json({
            success: false,
            message: "The password is incorrect",
          });
        }
  
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id.toString(),
          },
          config.secret,
          { expiresIn: "1hr" }
        );
        // transport.sendMail({
        //     to: email,
        //     from: 'shop@node-complete.com',
        //     subject: 'Login succeeded!',
        //     html: '<h1>You have Logged in to E-shop</h1>'
        // });
        res.status(200).json({
          success: true,
          message: "Login successful",
          userId: user._id.toString(),
          userName: user.name,
          token: token,
          userSeller: user.isSeller,
          userAdmin: user.admin,
        });
      });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  };


exports.postReset = async(req,res,next) => {
    try{
        crypto.randomBytes(32, async(err,buffer) => {
            if(err) {
                res.status(500).json({
                    success: false,
                    message:'There was an error trying to reset password'
                })
            }
            const token = buffer.toString('hex');
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'No such user with email found'
                })
            } else {
                
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            const result = await user.save();
            // transport.sendMail({
            //     to: req.body.email,
            //     from: 'shop@node-complete.com',
            //     subject: 'Password reset',
            //     html: `
            //       <p>You requested a password reset</p>
            //       <p>Click this <a href="http://localhost:4200/profile/reset/${token}">link</a> to set a new password.</p>
            //     `
            // });
            res.status(200).json({
                success: true,
                message: 'A Link has been sent to your Email'
            })
        })
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


exports.resetPassword = async(req,res,next) => {
    const newPassword = req.body.passForm.newpassword;
    const userId = req.userId;
    const passwordToken = req.body.token;
    console.log(newPassword,userId,passwordToken);
    let resetUser;
    try {
        const user = await User.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() },
            _id: userId
        })
        bcrypt.hash(newPassword,12,async(err, hash) => {
            resetUser = user;
            resetUser.password = hash;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            await resetUser.save();
        })  
        res.status(200).json({
            success: true,
            message: 'Your password has been reset successfully'
        })

    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


exports.postAddress = async (req, res,next) => {
    const add1 = req.body.add1;
    const add2 = req.body.add2;
    const country = req.body.country;
    const state = req.body.state;
    const city = req.body.city;
    const pin = req.body.pin;
    try {
        const user = await User.findById(req.userId)
        if(!user) {
            // const error = new Error('User does not exist')
            // error.statusCode = 404;
            // throw error;
            return res.status(404).json({
                success: false,
                message: 'User does not exist'
            })  
        } 
        user.address.add1 = add1;
        user.address.add2 = add2;
        user.address.country = country;
        user.address.state = state;
        user.address.city = city;
        user.address.postalCode = pin;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Address saved successfully'
        })
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    } 
};

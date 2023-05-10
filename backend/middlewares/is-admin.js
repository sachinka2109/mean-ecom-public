const mongoose  = require('mongoose');
const User = require('../models/user');
const auth = require('./is-auth');

module.exports = (req,res,next) => {
    const user = User.findOne({_id:req.userId});
    try{
        if(user.admin === false) {
            return res.status(403).json({
                success: false,
                message: 'Only Admins Can go To this Section'
            })  
        }
        next();
    } catch(error) {
        return res.status(403).json({
            success: false,
            message: 'Only Admins Can go To this Section'
        })  
    }
}
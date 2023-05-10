const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        // const error = new Error('Invalid authorization header');
        // error.code = 401;
        // throw error;
        return res.status(401).json({
            success: false,
            message: 'Invalid authorization header'
        })   
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token,'secret-token');
        if(!decodedToken) {
            // new Error('Not Authenticated');
            // error.statusCode = 401;
            // throw error;
            return res.status(401).json({
                success: false,
                message: 'Not Authenticated'
            })  
        }
        req.userId = decodedToken.userId;
        next();
    } catch(error) {
        // error.statusCode = 500;
        // throw error;
        return res.status(401).json({
            success: false,
            message: 'Not Authenticated'
        })  
    }
}
const jwt = require('jsonwebtoken') //used to create jwt tokens 
const User = require('../models/user') // to get details about user schema 
const logger = require('../controllers/logger')
const Sentry = require('@sentry/node')

//Middle function to authemticate the user who is accessing the database , allowed only user which are logged  in to access the details of books
const authMiddleware = async (req, res, next) => {

    try {
        if(!req.header('Authorization')) //takes the header having authorization key  
        {
            Sentry.captureException('Authorization error')
            logger.error("Authorization error")
            throw new Error("Error");
        }
        const token = req.header('Authorization').replace('Bearer ', '') // used to remove 'bearer' from the token to be verified 
    
        const decoded = jwt.verify(token, 'randomstring') // used to verify the token provided with the token stored in the database
        const user = await User.findOne({ _id: decoded._id, role : decoded.role , 'tokens.token': token }) //used to find the respective user with help of decoding the token 
        if (!user) {
            Sentry.captureException('User not found')
            logger.error('User not found')
            throw new Error('User not found') // Throws error if user is found with the token provided 
        }

        req.user = user //stores the user found in the request
        next() //ends the middleware function 
    } catch (e) {
        Sentry.captureException(e)
        logger.error(e.message)
        res.status(401).send({ error: 'Please authenticate.' })
    }
}


//This function is run to authenticate whether the logged in user is Admin or customer 
//If he is authenticated as Admin only the he can various functions like post , update , delete books  
const authAdmin = async (req,res,next) => {
    if (req.user.role !== 'Admin') {
        Sentry.captureException('Customer cannot do this operation')
        logger.warn("Role is not admin")
        return res.status(403).json({ message: 'Access denied. Only Admin users can perform this operation.' });
      }
    
      next();
}

module.exports = {authMiddleware , authAdmin } //exports both module 
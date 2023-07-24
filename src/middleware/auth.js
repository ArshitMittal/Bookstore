const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authMiddleware = async (req, res, next) => {

    try {
        if(!req.header('Authorization'))
        {
            throw new Error("Error");
        }
        const token = req.header('Authorization').replace('Bearer ', '')
       // console.log(token)
        const decoded = jwt.verify(token, 'randomstring')
        const user = await User.findOne({ _id: decoded._id, role : decoded.role , 'tokens.token': token })
      //  if(user.role != 'Admin')
      //  return res.send(400).send('Only Admin is allowed to perform this operation')
        if (!user) {
            throw new Error()
        }

        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

const authAdmin = async (req,res,next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied. Only Admin users can perform this operation.' });
      }
    
      next();
}

module.exports = {authMiddleware , authAdmin }
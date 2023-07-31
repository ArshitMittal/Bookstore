const express = require('express')
const User = require('../models/user')
const { authMiddleware, authAdmin } = require('../middleware/auth')
const router = new express.Router()
const logger = require('./logger')

const controllerUser = {

    registerUser : async (req, res) => {
        const { error, value } = User.prototype.validateUserData(req.body); // will validate user req body using joi 
        if (error) {
            logger.error(error.details[0].message)
          return res.status(400).json({ error: error.details[0].message });
        }
         const user = new User(value)  // will create new user 
         try {
             await user.save() // will save data to the database 
             const token = await user.generateAuthToken() //will generate token for authenticating users 
             res.status(201).send({ user, token })
         } catch (e) {
            logger.error(e.message)
             res.status(400).send(e.message)
         }
     },

/* ****************************************************************************************************** */    

    loginUser : async (req, res) => {
        // console.log(req.body)
        const { error, value } = User.prototype.validateUserDataLogin(req.body); // will validate user req body using joi 
        if (error) {
            logger.error(error.details[0].message)
          return res.status(400).json({ error: error.details[0].message });
        }
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password) // will check the user credentials
            const token = await user.generateAuthToken()
            res.send({ user, token })
        } catch (e) {
            logger.error(e.message)
            res.status(400).send(e.message)
        }
    },

    
}

module.exports = controllerUser
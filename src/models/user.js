const mongoose = require('mongoose') //used to define schema for the book collection
const validator = require('validator') //inbuilt module to validate the various details provided by the user 
const bcrypt = require('bcryptjs') //used to encrypt the passwords in form of hash 
const jwt = require('jsonwebtoken') //used to create webtokens 
const Book = require('./books') //used to get details about the 
const Joi = require('joi') //used to validate the request 
//here user schema is defined 
const logger = require('../controllers/logger')
const Sentry = require('@sentry/node')

logger.warn('IN')



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                Sentry.captureException('Invalid email')
                logger.error('Invalid email')
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                Sentry.captureException('Invalid Password')
                logger.error('Invalid Password')
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    role :{
        type : String,
        enum : ['Admin','Customer'],
        default : 'Customer'
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// Define a Joi schema for validation


userSchema.virtual('Books', {
    ref: 'Book',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() , role : user.role.toString() }, 'randomstring')
    
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async ( email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        Sentry.captureException('User not found')
        logger.error('User Not found')
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        Sentry.captureException('Incorrect password')
        logger.error('Incorrect Password')
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        logger.info('Pasword is converted to hash')
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete user Books when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Book.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

const userValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(7).required(),
    role: Joi.string().valid('Admin', 'Customer').default('Customer'),
  })
  
  // Add a method to the userSchema to validate data against the Joi schema
  User.prototype.validateUserData = function (data) {
    return userValidationSchema.validate(data);
  }

  const userValidationSchemaLogin = Joi.object({
    //name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(7).required(),
  })
  
  // Add a method to the userSchema to validate data against the Joi schema
  User.prototype.validateUserDataLogin = function (data) {
    return userValidationSchemaLogin.validate(data);
  }


module.exports = User
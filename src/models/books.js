
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const BookSchema = new mongoose.Schema({
    title: {
                type :String,
                trim :true,
                require:true,
            },
            author:{
                type:String,
                reqquire : true , 
                trim:true
            },
            genre:{
                type:String,
                trim: true
            },
            price :{
                type : Number,
                 validate(value)
                  {
                     if(value<0)
                     throw new Error('Price must be greater than 0')
                  }
             },
             stock: {
                 type: Number,
                 validate(value)
                 {
                     if(value<0)
                     throw new Error('Value cannot be less than 0')
                 }
        
             }
})



const Book = mongoose.model('Book', BookSchema)



module.exports = {Book};
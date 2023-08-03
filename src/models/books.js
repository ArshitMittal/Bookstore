
const mongoose = require('mongoose') //used to define schema for the book collection 
const Joi = require('joi')
const Sentry = require('@sentry/node')

//Schema for the book collection is defined here 
const BookSchema = new mongoose.Schema({
    title: {
                type :String, //describe the input type (accepts string type )
                trim :true,
                require:true, //is necessary to fill while entering new book details  
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
                 validate(value) //used to validate only positive value 
                  {
                     if(value<0)
                     {
                      Sentry.captureException('Price cannot be negative number')
                       throw new Error('Price must be greater than 0')
                     }
                  }
             },
             stock: {
                 type: Number,
                 validate(value)  //used to validate only positive value 
                 {
                     if(value<0)
                     {
                      Sentry.captureException('Stock cannot be negative')
                       throw new Error('Value cannot be less than 0')
                     }
                 }
        
             },

},{
  timestamps: true
 })



const Book = mongoose.model('Book', BookSchema)
// Define a Joi schema for validation 
const bookValidationSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  genre: Joi.string().required(),
  price: Joi.number().required().positive(),
  stock: Joi.number().required().positive(),
});

// Add a method to the Book model to validate data against the Joi schema
Book.prototype.validateBookData = function (data) {
  return bookValidationSchema.validate(data);
};


//Add method to only check for validation while updating the book details 
const bookValidationSchemaUpdate = Joi.object({
    title: Joi.string(),
    author: Joi.string(),
    genre: Joi.string(),
    price: Joi.number().positive(),
    stock: Joi.number().positive()
  });
  
  // Add a method to the Book model to validate data against the Joi schema
  Book.prototype.validateBookDataUpdate = function (data) {
    return bookValidationSchemaUpdate.validate(data);
  };

module.exports = {Book};
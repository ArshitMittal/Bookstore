
const mongoose = require('mongoose') //used to define schema for the book collection
//Schema for the book collection is defined here 
const PaymentSchema = new mongoose.Schema({
            bookID :{
                type : String,
                require : true
            },
            PaymentId: {
                type : String
            },
            card_number : {
                type :String, //describe the input type (accepts string type )
                trim :true,
                require:true, //is necessary to fill while entering new book details  
            },
            cvv :{
                type:String,
                reqquire : true , 
                trim:true
            },
            currency :{
                type:String,
                trim: true
            },
            amount :{
                type : Number,
             }

},{
  timestamps: true
 })



const Payments = mongoose.model('Payments', PaymentSchema)


module.exports = {Payments};
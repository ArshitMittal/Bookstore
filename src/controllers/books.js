const express = require('express')
const {Book} = require('../models/books')// to get details of bookschema 
const {Payments} = require('../models/payments')
// const {authMiddleware , authAdmin } = require('../middleware/auth') //used to call middleware before routing the api request
// const { ObjectId } = require('mongodb')
const router = new express.Router()
const mongoose=require('mongoose')
// const { findById } = require('../models/user')
const got = require('got')
const logger = require('./logger')
const Sentry = require('@sentry/node')

const bookController = { 

     postBook : async (req,res) => {
            //create an object and save the data fetched from the user 
            //const bookData = req.body
            const { error, value } = Book.prototype.validateBookData(req.body);
            if (error) {
                Sentry.captureException(error)
                logger.error(error.message)
                return res.status(400).json({ error: error.details[0].message });
            }
            const book = new Book({
                ...req.body,
                owner: req.user._id.toString()
            })
        // will save the created object (book) in the database else send error message
            try {
                await book.save()
                res.status(201).send(book)
            } catch (e) {
                Sentry.captureException(e)
                logger.error(e.message)
                res.status(400).send(e.message)
            }
    }, 
/* ****************************************************************************************************** */    

     getBooks : async (req,res) => {
        //defined various 
            const { genre, stock = {$gt : 0}, page = 1, limit = 3 ,skip = (page-1)*limit , sortBy = 'title:desc'} = req.query;
            const sort = {}
            if(sortBy)
            {
                const parts = sortBy.split(':')
                sort[parts[0]] = parts[1] === 'asc' ? 1 : -1 
            }
            // Construct the filter object based on the query parameters
            const filter = {};
            if (genre) {
                filter.genre = genre;
            }
            filter.stock = stock
            try {
                // Query the database using the filter and pagination options
                const books = await Book.find(filter)//.skip(skip).limit(limit).sort(sort);
                // console.log(books)
                // Get the total count of books matching the filter for pagination
                const totalCount = await Book.countDocuments(filter);
                // Return the paginated list of books and total count in the response
                res.json({ books})
            }catch (e) {
                Sentry.captureException(e)
                logger.error(e.message)
                res.status(500).send(e.message)
            }
    },
    
 /* ****************************************************************************************************** */    

     getBookId : async (req,res) => {
            const _id = req.params.id
            try {
                const books = await Book.findOne({ _id})
                if(!books) {
                    Sentry.captureException('Book not found')
                    logger.error('Book not found')
                    return res.status(404).send('Incorrect Book Id')
                }
                res.send(books)
            } catch (e) {
                Sentry.captureException(e)
                logger.error(e.message)
                res.status(500).send()
            }
    },

/* ****************************************************************************************************** */    
     
     updateBook : async (req,res) => {
            const { error, value } = await Book.prototype.validateBookDataUpdate(req.body); // use to check validation via JOI 
            if (error) {
                Sentry.captureException(error)
                logger.error(error.message)
                return res.status(400).json({ error: error.details[0].message });
            }
            //console.log(value)
            const updates = Object.keys(req.body)
            const allowedUpdates = ['title','author', 'price','stock','genre']
            const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // only certain updates will be allowed 
            if (!isValidOperation) {
                Sentry.captureException('Invalid Update operation')
                logger.error('Invalid updates')
                return res.status(400).send({ error: 'Invalid updates!' })
            }
            try {
                const val = req.params.id;
                const objectId = new mongoose.Types.ObjectId(val);
                // Use the converted ObjectId to find the book
                const books = await Book.findOne({ _id: objectId });
                console.log(books);
                if (!books) {
                    Sentry.captureException('Book not found')
                    logger.error('Book not found')
                    return res.status(404).send('Book not found');
                }
                const updates = Object.keys(req.body);
                // Use set() method to update properties
                updates.forEach((update) => {
                    books[update] = req.body[update];
                })
                console.log(books);
                // Save the changes
                await books.save();
                res.send(books)
                } catch (e) {
                    Sentry.captureException(e)
                    logger.error(e.message)
                    res.status(400).send(e.message)
                }
    },

/* ****************************************************************************************************** */    
    
     deleteBook : async (req,res) => {
                try {
                    const id = req.params.id;
                    const books = await Book.findOneAndDelete(id)
            
                    if (!books) {
                        Sentry.captureException('Book not found')
                        logger.error('book not found')
                        res.status(404).send('book bot found')
                    }
                    res.send(books)
                    
                } catch (e) {
                    Sentry.captureException(e)
                    logger.error(e.message)
                    res.status(500).send(e.message)
                }
    },
    buyBook : async (req,res) => {
        try {
            const _id = req.params.id
            const book = await Book.findById({_id})
            if(!book)
            {
                Sentry.captureException('Book not found')
                logger.error('Book not found')
                throw new Error('Book not found')
            }
            console.log(book)
            if(book.stock === 0 )
            {
                logger.warn('Out of Stock')
                throw new Error('Can\'t purchase out of stock ')
            }
            console.log(req.body)
            const {body} = await got.post('https://stoplight.io/mocks/skeps/book-store:master/12094368/misc/payment/process',{
            json: req.body,
            responseType : 'json'})
		    console.log(body);
            await Book.findOneAndUpdate({_id},{stock : book.stock-1});
            const payment = new Payments({
                bookID : book._id,
                ...req.body,
                PaymentId : body.payment_id
            })
            console.log(payment)
            //payment._id = body.payment_id
            await payment.save()
            res.send(body)
	        }catch(e){
                Sentry.captureException(e)
                logger.error(e.message)
                console.log(e);
                res.status(400).send(e.message)
        }
    }
} 

module.exports = bookController
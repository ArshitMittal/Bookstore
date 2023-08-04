const express = require('express')
const {Book} = require('../models/books') // to get details of bookschema 
const {authMiddleware , authAdmin } = require('../middleware/auth') //used to call middleware before routing the api request
const { ObjectId } = require('mongodb')
const router = new express.Router()
const mongoose=require('mongoose')
const bookController = require('../controllers/books')
console.log(bookController.deleteBook)
router.get('/users/books.html',(req,res) => {
    res.sendFile('/Users/arshit.mittal/Desktop/Bookstore/public/books.html')
})
router.post('/books', authMiddleware , authAdmin , bookController.postBook)
router.get('/books' , authMiddleware , bookController.getBooks)
router.get('/books/:id', authMiddleware , bookController.getBookId)
router.patch('/books/:id',authMiddleware,authAdmin, bookController.updateBook)
router.delete('/books/:id',authMiddleware ,authAdmin, bookController.deleteBook)
router.post('/buy/books/:id',authMiddleware,bookController.buyBook)

module.exports = router
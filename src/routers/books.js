const express = require('express')
const {Book} = require('../models/books')
const {authMiddleware , authAdmin } = require('../middleware/auth')
const router = new express.Router()

router.post('/books', authMiddleware , authAdmin, async (req, res) => {
    const book = new Book({
        ...req.body,
        owner: req.user._id.toString()
    })

    try {
        await book.save()
        res.status(201).send(book)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/books' ,authMiddleware,async (req, res) => {
    try {
         const books = await Book.find({})
        res.send(books)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/books/:id', authMiddleware, async (req, res) => {
    const _id = req.params.id

    try {
        const books = await Book.findOne({ _id})

        if (!books) {
            return res.status(404).send()
        }

        res.send(books)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/books/:id',authMiddleware,authAdmin, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title','author', 'price','stock']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        console.log(req.params.id)
        const books = await Book.findById(req.params.id.toString())

        if (!books) {
            return res.status(404).send()
        }

        updates.forEach((update) => books[update] = req.body[update])
        console.log(books)
        await books.save()
        res.send(books)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/books/:id',authMiddleware ,authAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id) 
        console.log(id)
        //const id = req.params.id
        const books = await Book.findOneAndDelete(id)
        console.log(books)

        if (!books) {
            res.status(404).send()
        }
        res.send(books)
        //books.remove()
        
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router
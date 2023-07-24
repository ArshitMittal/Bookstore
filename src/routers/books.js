const express = require('express')
const {Book} = require('../models/books') // to get details of bookschema 
const {authMiddleware , authAdmin } = require('../middleware/auth') //used to call middleware before routing the api request
const { ObjectId } = require('mongodb')
const router = new express.Router()
const mongoose=require('mongoose')

//used to enter the new book details before entering authMiddleware makes sure that user is logged in 
//authAdmin makes sure that the logged in user is Admin (only the Admin has access to enter details )
router.post('/books', authMiddleware , authAdmin, async (req, res) => {
    //create an object and save the data fetched from the user 
    //const bookData = req.body
    const { error, value } = Book.prototype.validateBookData(req.body);
    if (error) {
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
        res.status(400).send(e.message)
    }
})

//used to get  all book details stored in the database based on different filters like genre , stock  , before entering authMiddleware makes sure that user is logged in 
//since any user who is logged in can read the book details , so no Admin authentication is reqd. 
router.get('/books' ,authMiddleware,async (req, res) => {
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
    const books = await Book.find(filter).skip(skip).limit(limit).sort(sort);
   // console.log(books)
    // Get the total count of books matching the filter for pagination
    const totalCount = await Book.countDocuments(filter);

    // Return the paginated list of books and total count in the response
    res.json({ books, totalCount })
    }catch (e) {
        res.status(500).send(e.message)
    }
})

//used to get details of specific book stored in the database ,before entering authMiddleware makes sure that user is logged in 
//since any user who is logged in can read the book details , so no Admin authentication is reqd.
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

//used to update the details of specified book by id , Only admin has access to do it that's why authAdmin is used 
router.patch('/books/:id',authMiddleware,authAdmin, async (req, res) => {
    const { error, value } = await Book.prototype.validateBookDataUpdate(req.body); // use to check validation via JOI 
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    console.log(value)
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title','author', 'price','stock','genre']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // only certain updates will be allowed 
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const val = req.params.id;

  const objectId = new mongoose.Types.ObjectId(val);

  // Use the converted ObjectId to find the book
  const books = await Book.findOne({ _id: objectId });
  console.log(books);

  if (!books) {
    return res.status(404).send('Book not found');
  }

  const updates = Object.keys(req.body);

  // Use set() method to update properties
  updates.forEach((update) => {
    books[update] = req.body[update];
  });

  console.log(books);

  // Save the changes
  await books.save();
        res.send(books)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//used to delete specified book by id , Only admin has access to do it that's why authAdmin is used 
router.delete('/books/:id',authMiddleware ,authAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const books = await Book.findOneAndDelete(id)

        if (!books) {
            res.status(404).send()
        }
        res.send(books)
        
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router
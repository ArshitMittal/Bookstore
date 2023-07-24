const express = require('express')
require('./db/mongooseFile')
const User = require('./models/user')
const Book = require('./models/books')
const userRouter = require('./routers/user')
const bookRouter = require('./routers/books')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(bookRouter)

app.listen(port, (error) => {
    console.log(error);
})

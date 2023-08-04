const express = require('express') // To call express which helps to establish connection 
require('./db/mongooseFile')      //To connect the server with database 
const User = require('./models/user')  //To get info about how the user details are to be stored in the database 
const Book = require('./models/books')  //To get info about how the book details are to be stored in the database 
const userRouter = require('./routers/user') //helps to route the different api requests and perform action accordingly on user
const bookRouter = require('./routers/books') //helps to route the different api requests and perform action accordingly on book
const logger = require('./controllers/logger')
const app = express()

const path = "/Users/arshit.mittal/Desktop/Bookstore/public"

app.use(express.static(path))

const port = process.env.PORT || 3000
const Sentry = require('@sentry/node');
Sentry.init({
    release: process.env.VERSION,
    environment: process.env.ENV,
    dsn: "https://3b55aafdc6804d0b948ae2478917bccb@o201295.ingest.sentry.io/4505602112356352",
    serverName : "ARHIT_BOOK_STORE"
});

module.exports = Sentry

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
app.use(express.json())
app.use(userRouter)
app.use(bookRouter)


app.listen(port, (error) => {
    Sentry.captureException(error)
    logger.error(error)
    console.log(error);
})

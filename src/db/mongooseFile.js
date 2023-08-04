//Here the connection is established with the database and new database 'Bookstore-api' will be created 
const Mongoose = require('mongoose')
Mongoose.connect("mongodb://localhost:27017/Bookstore-api",{
    useNewUrlParser : true,
})


// console.log("Arshit")


// module.exports = {Mongoose}
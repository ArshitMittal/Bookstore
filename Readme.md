# Bookstore
Bookstore is a nodejs project where users can get to know about details of different books like {title,author,price,stock}


## Getting Started
Follow these instructions to get the project up and running on your local machine.



### Prerequisites
- Node.js 
- Mongodb



### Project Setup
1. Clone the repository: run `git clone https://github.com/ArshitMittal/Bookstore.git`
2. run `cd bookstore`
3. run `npm init -y`
4. Install dependencies: run command `npm install`


### Set up the database:
Choose a Mongodb database and set up a connection to it 




### user Api endpoints 
#### User Authentication
1. Register a new user
2. Endpoint: POST /auth/register
3. Create a new user by providing the following fields in the request body: {
name: User's name (string, required).
email: User's email address (string, required and must be a valid email).
password: User's password (string, required and must be at least 7 characters and donot use password as password).
role : must be either 'Admin' or 'Customer' only.
}

#### User Login
Endpoint: POST /auth/login
1. Login as an existing user by providing the following fields in the request body:
{name : username (must br string , required)
email: User's email address (string, required and must be a valid email).
password: User's password (string, required).
}
The API will return a JWT token, which should be used for authentication on protected routes.




### Book API Endpoints
#### Retrieve a paginated list of books
Endpoint: GET /books
Retrieve a paginated list of books with filtering options like genre and availability (in stock).
Query parameters:
{
genre: Filter books by genre (string, optional).
Stock: Filter books by availability (boolean, optional).
page: Page number for pagination (number, optional, default: 1).
limit: Number of items per page (number, optional, default: 10).
Retrieve a specific book by ID
Endpoint: GET /books/:id
}
#### Retrieve a specific book by its ID. Replace :id with the ID of the book.
Create a new book
Endpoint: POST /books
#### Create a new book (only accessible to Admin users).
Required fields in the request body:
{
title: Title of the book (string, required).
author: Author of the book (string, required).
genre: Genre of the book (string, required).
price: Price of the book (number, required).
stock: Stock availability of the book (number, required).
}
#### Update an existing book
Endpoint: PUT /books/:id
Update an existing book (only accessible to Admin users). Replace :id with the ID of the book to update.
Include the fields to be updated in the request body.
#### Delete a book
Endpoint: DELETE /books/:id 
Delete a book (only accessible to Admin users). Replace :id with the ID of the book to delete.




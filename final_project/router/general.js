const express = require('express');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


/* Novo user */

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Must provide username and password" });
    }

    if (isValid(username)) {
        return res.status(400).json({ message: `User ${username} already registered` });
    }
    
    users.push({ username, password });
    return res.status(201).json({ message: `User ${username} registered successfully` });

});


/* Acessa todos os Livros */

public_users.get('/', function (req, res) {
    retrieveBooks()
        .then((books) => {
            res.send(JSON.stringify(books));
        })
        .catch((error) => {
            console.error('Error fetching books:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
 
const retrieveBooks = () =>  new Promise( (resolve, reject) => resolve(books) ); 


/*   consulta pelo nome do autor   */

public_users.get('/author/:author', function (req, res) {
    getByAuthor(req.params.author)
        .then((result) => res.send(result))
        .catch((error) => res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' }));
});

function getByAuthor(author) {
    return new Promise((resolve, reject) => {
        const matchingBooks = Object.values(books).filter((book) => book.author === author);
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: `Author ${author} not found` });
        }
    });
}


/*   consulta pelo titulo do livro   */

public_users.get('/title/:title', function (req, res) {
    getByTitle(req.params.title)
        .then((result) => res.send(result))
        .catch((error) => res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' }));
});

function getByTitle(title) {
    return new Promise((resolve, reject) => {
        const matchingBooks = Object.values(books).filter((book) => book.title === title);
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: `Title ${title} not found` });
        }
    });
} 


/*   ISBN   */
public_users.get('/review/:isbn', function (req, res) {
    getByISBN(req.params.isbn)
        .then((result) => {
            const reviews = result.reviews || {};
            res.send(reviews);
        },
            (error) => res.status(error.status).json({ message: error.message })
        );
  });

  public_users.get('/isbn/:isbn', function (req, res) {
    getByISBN(req.params.isbn)
        .then((result) => res.send(result))
        .catch((error) => res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' }));
  });


function getByISBN(isbn) {
    return new Promise((resolve, reject) => {
        if (books[parseInt(isbn)]) {
            resolve(books[parseInt(isbn)]);
        } else {
            reject({ status: 404, message: `ISBN ${isbn} not found` });
        }
    });
}


module.exports.general = public_users;

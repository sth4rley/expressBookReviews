const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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

/*public_users.get('/', async function (req, res) {
    try {
      const books = await retrieveBooks();
      res.send(JSON.stringify(books));
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });  
*/
// Rota public_users.get('/') usando Promise callbacks
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


//async function retrieveBooks() {
//  return books; //já retorna uma Promise implicitamente, pois é marcada como async
//}
function retrieveBooks() {
    return new Promise((resolve, reject) => resolve(books));
  }
  


// Get book details based on ISBN
/*
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const result = await getByISBN(req.params.isbn);
    res.send(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
  }
});

*/
  
  // Rota public_users.get('/isbn/:isbn') usando Promise callbacks
  public_users.get('/isbn/:isbn', function (req, res) {
    getByISBN(req.params.isbn)
      .then((result) => res.send(result))
      .catch((error) => res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' }));
  });

/*

async function getByISBN(isbn) {
  return new Promise((resolve, reject) => {
    let isbnNum = parseInt(isbn);
    if (books[isbnNum]) {
      resolve(books[isbnNum]);
    } else {
      reject({ status: 404, message: `ISBN ${isbn} not found` });
    }
  });
}
*/

function getByISBN(isbn) {
    return new Promise((resolve, reject) => {
      let isbnNum = parseInt(isbn);
      if (books[isbnNum]) {
        resolve(books[isbnNum]);
      } else {
        reject({ status: 404, message: `ISBN ${isbn} not found` });
      }
    });
  }


// Get book details based on author
/*public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    retrieveBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
});*/

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
  
  // Rota public_users.get('/author/:author') usando Promise callbacks
  public_users.get('/author/:author', function (req, res) {
    getByAuthor(req.params.author)
      .then((result) => res.send(result))
      .catch((error) => res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' }));
  });
  

/*

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  filterBooksByProperty(req, res, 'title', title);
});

// Função genérica para filtrar livros com base em uma propriedade
async function filterBooksByProperty(req, res, property, value) {
    try {
      const books = await retrieveBooks();
      const filteredBooks = Object.values(books).filter((book) => book[property] === value);
      res.send(filteredBooks);
    } catch (error) {
      console.error(`Error fetching books for ${property}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  getByISBN(req.params.isbn)
    .then(
      result => res.send(result.reviews),
      error => res.status(error.status).json({ message: error.message })
    );
});
*/

// Remova a palavra-chave 'async' da função getByTitle

  // Rota public_users.get('/title/:title') usando Promise callbacks
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

/*
  // Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  getByISBN(req.params.isbn)
    .then(
      result => res.send(result.reviews),
      error => res.status(error.status).json({ message: error.message })
    );
});
*/

  // Rota public_users.get('/review/:isbn') usando Promise callbacks
public_users.get('/review/:isbn', function (req, res) {
    getByISBN(req.params.isbn)
      .then(
        (result) => {
          const reviews = result.reviews || {};
          res.send(reviews);
        },
        (error) => res.status(error.status).json({ message: error.message })
      );
  });

  

module.exports.general = public_users;

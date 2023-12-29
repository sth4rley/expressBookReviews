const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => users.some(user => user.username === username);

const authenticatedUser = (username, password) => users.some(user => user.username === username && user.password === password);


//only registered users can login
regd_users.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (await authenticatedUser(username, password)) {
      const accessToken = jwt.sign({ data: password }, "access", { expiresIn: 3600 });
      req.session.authorization = { accessToken, username };
      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.session.authorization.username;

    if (books[isbn]) {
      const book = books[isbn];
      book.reviews[username] = review;
      return res.status(200).send("Review successfully posted");
    } else {
      return res.status(404).json({ message: `ISBN ${isbn} not found` });
    }
  } catch (error) {
    console.error('Error while adding a review:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params;
    const username = req.session.authorization.username;

    if (books[isbn]) {
      const book = books[isbn];
      delete book.reviews[username];
      return res.status(200).send("Review successfully deleted");
    } else {
      return res.status(404).json({ message: `ISBN ${isbn} not found` });
    }
  } catch (error) {
    console.error('Error while deleting a review:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

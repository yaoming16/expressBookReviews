const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

// User registration
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});



// Get the book list available in the shop - Normal one
// public_users.get('/', function (req, res) {
//   res.json(books);
// });

// Get the book list available in the shop - With promise

function fetchBooks() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

public_users.get('/', function (req, res) {
  fetchBooks().then((booksSent) => res.send(booksSent));
});



// Get book details based on ISBN - Normal one
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn;

//   if (books[isbn]) {
//     let bookToSend = {
//       [isbn]: books[isbn]
//     };
//     res.json(bookToSend);
//   } else {
//     return res.status(400).json({ message: "Invalid ISBN" });
//   }
// });

// Get book details based in ISBN - With promise

function fetchByISBN(isbnTest) {
  return new Promise((resolve, reject) => {
    let isbn = parseInt(isbnTest);
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "No books with this ISBN found." });
    }
  })
}

public_users.get('/isbn/:isbn', function (req, res) {
  fetchByISBN(req.params.isbn)
    .then(
      result => res.send(result),
      error => res.status(error.status).json({ message: error.message })
    );
});

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   const author = req.params.author;
//   let toReturn = {};
//   for (let book in books) {
//     if (books[book].author === author) {
//       toReturn[book] = books[book];
//     }
//   }
//   if (Object.keys(toReturn).length > 0) {
//     res.json(toReturn);
//   } else {
//     return res.status(400).json({ message: "Invalid author" });
//   }
// });

// Get book details based on author - With promise
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  fetchBooks()
    .then((bookInfo) => Object.values(bookInfo))
    .then((booksAuthor) => booksAuthor.filter((bookAuthor) => bookAuthor.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
});

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   const title = req.params.title;
//   let toReturn = {};
//   for (let book in books) {
//     if (books[book].title === title) {
//       toReturn[book] = books[book];
//     }
//   }
//   if (Object.keys(toReturn).length > 0) {
//     res.json(toReturn);
//   } else {
//     return res.status(400).json({ message: "Invalid title" });
//   }
// });

// Get all books based on title - With promise

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  fetchBooks()
    .then((bookInfo) => Object.values(bookInfo))
    .then((booksTitle) => booksTitle.filter((bookTitle) => bookTitle.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.json(books[isbn].reviews);
  } else {
    return res.status(400).json({ message: "Invalid ISBN" });
  }
});

module.exports.general = public_users;

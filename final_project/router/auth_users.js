const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "yaoming16", password: "1234" }, { username: "yaoming16", password: "1234" }];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.query.review;
  let isbn = req.params.isbn;
  let username = req.session.authorization.username

  if (books[isbn]) {
    books[isbn].reviews[username] = review
    res.send("Added a review from " + username + ": " + books[isbn].reviews[username] + " for isbn " + isbn)
  } else {
    return res.status(400).json({ message: "Invalid ISBN" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization.username;
  let isbn = req.params.isbn;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      let deleated = books[isbn].reviews[username];
      Reflect.deleteProperty(books[isbn].reviews, username);
      res.send(`Successfully Deleated this review: ${deleated} by ${username}`);
    } else {
      return res.status(400).json({ message: "No review available to deleate" });
    }
  } else {
    return res.status(400).json({ message: "Invalid ISBN" });
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

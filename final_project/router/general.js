const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new customer
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Username and password are required." });
    }

    if (isValid(username)) {
        return res.status(400).json({ message: "Customer already exists!" });
    }

    users.push({ username: username, password: password });
    return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
});

// Task 1 & Task 10: Get the book list available in the shop using Promise callback / async-await
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        try {
            resolve(books);
        } catch (err) {
            reject(err);
        }
    });

    getBooks
        .then((bks) => res.status(200).send(JSON.stringify(bks, null, 4)))
        .catch((error) => res.status(500).json({ message: "Error fetching book list", error: error.message }));
});

// Task 2 & Task 11: Get book details based on ISBN using Promise callback / async-await
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
        }
    });

    getBookByISBN
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Task 3 & Task 12: Get book details based on author using Promise callback / async-await
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    const getBooksByAuthor = new Promise((resolve, reject) => {
        let matchingBooks = [];
        let isbns = Object.keys(books);

        isbns.forEach((isbn) => {
            if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
                matchingBooks.push({
                    isbn: isbn,
                    title: books[isbn].title,
                    reviews: books[isbn].reviews
                });
            }
        });

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: `No books found by author '${author}'` });
        }
    });

    getBooksByAuthor
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Task 4 & Task 13: Get all books based on title using Promise callback / async-await
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const getBooksByTitle = new Promise((resolve, reject) => {
        let matchingBooks = [];
        let isbns = Object.keys(books);

        isbns.forEach((isbn) => {
            if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
                matchingBooks.push({
                    isbn: isbn,
                    author: books[isbn].author,
                    reviews: books[isbn].reviews
                });
            }
        });

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: `No books found with title '${title}'` });
        }
    });

    getBooksByTitle
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});

module.exports.general = public_users;

const express = require("express");

const BookService = require("../services/bookService");

const bookService = new BookService();
const bookRouter = express.Router();

bookRouter.get("/", async (req, res) => {
  try {
    const books = await bookService.getBooks();
    res.status(200).json({ books });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

module.exports = bookRouter;

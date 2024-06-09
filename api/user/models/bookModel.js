// models/bookModel.js

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  book_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  authors: [String],
  image: String,
  publisher: String,
  publishedDate: String,
  pageCount: Number,
  categories: [String],
  previewLink: String,
  description: String,
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

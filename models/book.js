const mongoose = require('mongoose')
const bookSchema = new mongoose.Schema({
  bookName: String,
  author: String,
  isRead: Boolean
})
const Book = mongoose.model('Book', bookSchema)
module.exports = Book

const dotenv = require('dotenv') // require package
dotenv.config() // Loads the environment variables from .env file
const express = require('express')
const app = express()
const mongoose = require('mongoose') // require package
const methodOverride = require('method-override') // new
const morgan = require('morgan') //new

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})
const Book = require('./models/book.js')

app.get('/', async (req, res) => {
  res.render('index.ejs')
})
app.get('/books', async (req, res) => {
  const allBooks = await Book.find()
  res.render('books/index.ejs', { books: allBooks })
})
app.get('/books/new', (req, res) => {
  res.render('books/new.ejs')
})
app.get('/books/:bookId', async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId)
  res.render('books/show.ejs', { book: foundBook })
})
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method')) // new
app.use(morgan('dev')) //new
app.post('/books', async (req, res) => {
  if (req.body.isRead === 'on') {
    req.body.isRead = true
  } else {
    req.body.isRead = false
  }
  await Book.create(req.body)
  res.redirect('/books')
})
app.delete('/books/:bookId', async (req, res) => {
  await Book.findByIdAndDelete(req.params.bookId)
  res.redirect('/books')
})

app.put('/books/:bookId', async (req, res) => {
  if (req.body.isRead === 'on') {
    req.body.isRead = true
  } else {
    req.body.isRead = false
  }

  await Book.findByIdAndUpdate(req.params.bookId, req.body)

  res.redirect(`/books/${req.params.bookId}`)
})
app.get('/books/:bookId/edit', async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId)
  res.render('books/edit.ejs', {
    book: foundBook
  })
})
app.listen(3000, () => {
  console.log('Listening on port 3000')
})

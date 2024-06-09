// services/userService.js

const {hashPassword,comparePasswords} = require("../../../utils/bcryptUtils");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Book = require('../models/bookModel');
const AppError = require('../../../utils/AppError');

exports.registerUserService = async (name, email, password) => {
  let user = await User.findOne({ email });
  if (user) {
    throw new AppError('User already exists', 400);
  }

  const hashedPassword = await hashPassword(password);
  user = new User({ name, email, password: hashedPassword });
  await user.save();

  return { message: 'User registered successfully' };
};

exports.loginUserService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await comparePasswords(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const payload = { user: { id: user.id } };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  return { token };
};


exports.addBookToReadingListService = async (userId, bookDetails) => {

  try {
    // Check if the book already exists in the Book collection
    let book = await Book.findOne({ book_id: bookDetails.book_id });
    if (!book) {
      // If the book does not exist, create a new book document
      book = new Book(bookDetails);
      await book.save();
    }

    // Check if the book is already in the user's reading list
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const bookExists = user.readingList.some((item) => item.book.toString() === book._id.toString());
    
    if (bookExists) {
     throw new AppError('Book already added to reading list', 400);
    }

    // Add the book to the user's reading list
    user.readingList.push({ book: book._id });
    await user.save();

    return { msg: 'Book added to reading list successfully' };
  } catch (err) {
    if (err instanceof AppError) {
      throw err; // Rethrow the specific AppError
    } else {
      throw new AppError('Server Error', 500);
    }
  }
};

exports.removeBookFromReadingListService = async (userId, bookId) => {
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    user.readingList = user.readingList.filter((item) => {
      const isMatch = item.book.toString() !== bookId;
    
      return isMatch;
    });
 
    await user.save();
    return { msg: 'Book removed from reading list successfully' };
  } catch (err) {
    if (err instanceof AppError) {
      throw err; // Rethrow the specific AppError
    } else {
      throw new AppError('Server Error', 500);
    }
  }
};

exports.getReadingListService = async (userId) => {
  try {
    const user = await User.findById(userId).populate('readingList.book');
    // console.log('user: ', user);
    if (!user) {
      throw new AppError('User not found', 404);
    }

   return user.readingList  
  } catch (err) {
    if (err instanceof AppError) {
      throw err; // Rethrow the specific AppError
    } else {
      throw new AppError('Server Error', 500);
    }
  }
};

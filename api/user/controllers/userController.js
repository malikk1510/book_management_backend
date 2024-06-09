// controllers/authController.js

const { validationResult } = require('express-validator');
const { registerUserService, loginUserService ,addBookToReadingListService,removeBookFromReadingListService,getReadingListService} = require('../services/userServices');
const AppError = require('../../../utils/AppError');

exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const { name, email, password } = req.body;

  try {
    const result = await registerUserService(name, email, password);
    res.status(201).json({ msg: result.message });
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const { email, password } = req.body;

  try {
    const result = await loginUserService(email, password);
    res.json({ token: result.token });
  } catch (err) {
    next(err);
  }
};


exports.addBookToReadingList = async (req, res, next) => {
  const bookDetails = req.body;
  const userId = req.user.id;

  try {
    const result = await addBookToReadingListService(userId, bookDetails);
    if (result.error) {
      return res.status(400).json({ errors: [{ msg: result.error }] });
    }
    res.status(201).json({ msg: result.msg });
  } catch (err) {
    if (err instanceof AppError) {
      next(err); // Pass the specific AppError to the error handling middleware
    } else {
      next(new AppError('Server Error', 500)); // Pass a generic server error to the error handling middleware
    }
  }
};

exports.removeBookFromReadingList = async (req, res, next) => {
  const { bookId } = req.params;
  const userId = req.user.id;

  try {
    const result = await removeBookFromReadingListService(userId, bookId);
    if (result.error) {
      return res.status(400).json({ errors: [{ msg: result.error }] });
    }
    res.status(200).json({ msg: result.msg });
  } catch (err) {
    if (err instanceof AppError) {
      next(err); // Pass the specific AppError to the error handling middleware
    } else {
      next(new AppError('Server Error', 500)); // Pass a generic server error to the error handling middleware
    }
  }
};

exports.getReadingList = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const books = await getReadingListService(userId);
    console.log('books: ', books);
    res.status(200).json(books);
  } catch (err) {
    if (err instanceof AppError) {
      next(err); // Pass the specific AppError to the error handling middleware
    } else {
      next(new AppError('Server Error', 500)); // Pass a generic server error to the error handling middleware
    }
  }
};
// routes/authRoutes.js

const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser,addBookToReadingList,removeBookFromReadingList,getReadingList } = require('../controllers/userController');
const authMiddleware = require('../../../middleware/authMiddleware');
const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  registerUser
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);

router.post('/add/book', authMiddleware, addBookToReadingList);
router.delete('/remove/book/:bookId', authMiddleware, removeBookFromReadingList);
router.get('/books', authMiddleware, getReadingList);
module.exports = router;

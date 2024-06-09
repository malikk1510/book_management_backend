require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./utils/errorHandler');
const AppError = require('./utils/AppError');
const cors = require('cors');

//routes
const authRoutes = require('./api/user/routes/userRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Define routes
app.use('/api/auth', authRoutes);

// Handle undefined Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(errorHandler);


// Define port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

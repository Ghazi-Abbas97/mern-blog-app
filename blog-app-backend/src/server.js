require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const api = require('./api');

// Load .env variables
dotenv.config();

// Create Express app
const app = express();

// ===== Middleware =====
app.use(express.json());                  // Parse JSON bodies
app.use(helmet());                        // Set secure HTTP headers
app.use(cors());                          // Enable CORS
app.use(rateLimit({                       // Apply rate limiting
  windowMs: 15 * 60 * 1000,               // 15 minutes
  max: 100,                               // Max 100 requests per IP
  standardHeaders: true,                 // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false                   // Disable the `X-RateLimit-*` headers
}));

// ===== API Routes =====
app.use('/api', api); // use '/api' to make the route semantic

// ===== Error Handling Middleware =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});


// ===== MongoDB Connection + Server Start =====
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

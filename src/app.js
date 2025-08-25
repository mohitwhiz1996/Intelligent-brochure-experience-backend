require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const authRoutes = require('../src/routes/auth');
const userRoutes = require('../src/routes/user');
const brochureRoute = require('../src/routes/brochure');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Flipbook backend API is running' });
});

// TODO: Import and use routes here

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/flipbookdb';

mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/brochure', brochureRoute);
module.exports = app;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const feedbackRoutes = require('./routes/feedbackRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT;
const MONGODB_URI =process.env.MONGODB_URI;

app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Student Feedback Management API' }));
app.use('/api/feedback', feedbackRoutes);

app.use(errorHandler);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

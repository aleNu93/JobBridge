require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const serviceRoutes = require('./routes/serviceRoute');
const contractRoutes = require('./routes/contractRoute');
const ratingRoutes = require('./routes/ratingRoute');
const messageRoutes = require('./routes/messageRoute');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/uploads', require('express').static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
  res.json({ message: 'JobBridge API is running' });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
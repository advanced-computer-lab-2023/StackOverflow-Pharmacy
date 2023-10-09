const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());


// Database Connection
mongoose.connect('mongodb+srv://boodee197300:Abdo6617@cluster0.5vpr96y.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
const userRoutes = require('./routes/userRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const requestRoutes = require('./routes/requestRoutes');
const orderRoutes = require('./routes/orderRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const chatRoomRoutes = require('./routes/chatRoomRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use('/api/users', userRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/chatrooms', chatRoomRoutes);
app.use('/api/carts', cartRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

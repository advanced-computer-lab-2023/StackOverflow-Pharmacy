const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const app = express();
const cors=require('cors');
app.use(cors())
const port = process.env.PORT || 3000;
const validator = require('validator');
//testing
// Middleware to parse JSON data
app.use(express.json());

app.use(express.static('frontend/public'));
// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
const pharmacistRoutes = require('./routes/pharmacistRoutes');
const patientRoutes = require('./routes/patientRoutes');
const administratorRoutes = require('./routes/administratorRoutes');



app.use('/api/users', userRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/chatrooms', chatRoomRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/pharmacists', pharmacistRoutes); // Add pharmacistRoutes
app.use('/api/patients', patientRoutes); // Add patientRoutes
app.use('/admin', administratorRoutes); // Add administratorRoutes

app.all('*', (req, res) => res.status(404).send('Path Not Found'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

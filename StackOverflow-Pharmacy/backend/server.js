const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const cors = require('cors');
const path = require('path'); // Import the path module
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const http = require("http");
const { Server } = require("socket.io");
const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// Middleware to parse JSON data
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
// socket 
// const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //console.log(User Connected: ${socket.id});

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log(data.room);
  });
});
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
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/chatrooms', chatRoomRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/pharmacists', pharmacistRoutes);
app.use('/api/patients', patientRoutes);
app.use('/admin', administratorRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'homepage.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'admin.html'));
});

app.get('/addadmin', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'addadmin.html'));
});

// Add similar code for other HTML files and routes



// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
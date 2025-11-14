require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);

// Initialize socket.io with CORS support
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());

// Simple route to check if server is running
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Connect to MongoDB using URI from .env
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("MongoDB connection error:", err);
});

// Keep track of connected clients
let connectedClients = 0;

// Socket.io connection event
io.on('connection', (socket) => {
    connectedClients++;
    console.log(`New client connected: ${socket.id}. Total clients: ${connectedClients}`);

    // Socket disconnect event
    socket.on('disconnect', () => {
        connectedClients--;
        console.log(`Client disconnected: ${socket.id}. Total clients: ${connectedClients}`);
    });

    // Log any event received for debugging
    socket.onAny((event, ...args) => {
        console.log(`Socket event received: ${event}`, args);
    });
});

// Import tourist controllers
const touristControllers = require('./controllers/tourist.controller');

// API routes for tourists
app.post('/api/signUp', touristControllers.createTourist);
app.post('/api/login', touristControllers.loginTourist);
app.get('/api/tourists', touristControllers.getAllTourists);
app.get('/api/tourists/:id', touristControllers.getTouristById);
app.put('/api/tourists/:id', touristControllers.updateTourist);
app.delete('/api/tourists/:id', touristControllers.deleteTourists);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export io so it can be used in controllers
module.exports = io;

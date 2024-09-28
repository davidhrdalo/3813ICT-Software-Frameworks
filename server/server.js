// Main server file - Run using node or nodemon

const express = require('express'); // Import express.js
const app = express(); 
const cors = require('cors');
const http = require('http').Server(app); // HTTP server
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

// MongoDB client setup
const client = new MongoClient('mongodb://localhost:27017');

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit process on connection failure
  }
}
connectToMongoDB();

const io = require('socket.io')(http, {
    cors: {
        origin: ["http://localhost:4200"], // Allow requests from Angular frontend
        methods: ["GET", "POST"],
        credentials: true, // Enable credentials for WebSocket connections
    }
});

// Apply express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:4200', // Only allow requests from Angular app
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow credentials for API routes
}));

// Routes
require('./routes/api-auth.js')(app, client); // Route for user auth (login/sign up)
require('./routes/api-user.js')(app, client); // Route for user operations
require('./routes/api-group.js')(app, client); // Route for group operations
require('./routes/api-channel.js')(app, client); // Route for channel operations

// Socket.io logic
io.on('connection', (socket) => {
    // Log connection information
    console.log('User connected on port 3000: ' + socket.id);

    // Emit messages to all connected sockets
    socket.on('message', (message) => {
        io.emit('message', message);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// Node server listen config
const PORT = 3000;
http.listen(PORT, () => {
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    console.log('Server has been started on port ' + PORT + ' at ' + h + ':' + m);
});

// Additional info for SSL setup (if needed in the future)
// To switch to HTTPS, follow these steps:
// const https = require('https'),
//   fs = require('fs'),
//   options = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
//   };
// Replace http.listen() with https.createServer(options, app).listen(PORT)

// Main server file - Run using node or nodemon

const express = require('express'); // Import express.js
const app = express(); 
const cors = require('cors');
const http = require('http').Server(app); // HTTP server
const bodyParser = require('body-parser');
const formidable = require('formidable'); // Image upload
const path = require('path');
app.use('/data/images/profileImages', express.static(path.join(__dirname, 'data/images/profileImages')));
const { PeerServer } = require('peer');
const fs = require('fs');
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
require('./routes/api-user.js')(app, client, formidable, fs, path); // Route for user operations
require('./routes/api-group.js')(app, client, formidable, fs, path); // Route for group operations
require('./routes/api-channel.js')(app, client, formidable, fs, path); // Route for channel operations
require('./routes/api-chat.js')(app, client, formidable, fs, path); // Route for chat

// Socket.io logic
io.on('connection', (socket) => {
    // Log connection information
    console.log('User connected on port 3000: ' + socket.id);

    // Handle joinChannel event
    socket.on('joinChannel', ({ channelId, userId, username }) => {
        socket.join(channelId);
        console.log(`${username} joined channel ${channelId}`);
        // Notify other users in the channel
        socket.to(channelId).emit(`userJoined:${channelId}`, { username });
    });

    // Handle leaveChannel event
    socket.on('leaveChannel', ({ channelId, userId, username }) => {
        socket.leave(channelId);
        console.log(`${username} left channel ${channelId}`);
        // Notify other users in the channel
        socket.to(channelId).emit(`userLeft:${channelId}`, { username });
    });

    // Handle channelMessage event
    socket.on('channelMessage', (messageData) => {
        const channelId = messageData.channelId;
        console.log(`Message received in channel ${channelId} from ${messageData.username}: ${messageData.message}`);

        // Broadcast the message to the channel
        io.in(channelId).emit(`channelMessage:${channelId}`, messageData);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
        // Optionally, you can handle user disconnects here
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


// Video support changes below!

const sslOptions = {
    // generate a SSL certificate in the elf terminal.
    // openssl genrsa -out key.pem
    // openssl req -new -key key.pem -out csr.pem
    // openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
    // rm csr.pem
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

// Additional info for SSL setup (if needed in the future)
// To switch to HTTPS, follow these steps:
// const https = require('https'),
// Replace http.listen() with https.createServer(sslOptions, app).listen(PORT)

// Peer - to run Peer video support
PeerServer({
    port: 3001,
    path: '/',
    ssl: sslOptions
});

console.log(`Starting SSL PeerServer at: ${3001}`);
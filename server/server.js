// Main server file - Run using node or nodemon

const express = require('express'); // Import express.js
const app = express(); 
const cors = require('cors');
const http = require('http').Server(app);
// const path = require('path');
const bodyParser = require('body-parser');
const io = require('socket.io')(http, {
    cors: {
        origin: ["http://localhost:4200"],
        methods: ["GET", "POST"],
    }
});

// Apply express middleware
app.use(cors()); // Enable CORS for all origins by default
app.use(bodyParser.json()); // Parse JSON bodies

// Routes
require('./routes/api-auth.js')(app); // Route for user auth (login/ sign up) api
require('./routes/api-user.js')(app); // Route for user api
require('./routes/api-group.js')(app); // Route for group api
require('./routes/api-channel.js')(app); // Route for channel api

// Listen file
const server = require('./listen.js');
const PORT = 3000;

// Socket file
const sockets = require('./socket.js');
sockets.connect(io, PORT);

// Start server listening for requests.
server.listen(http, PORT);
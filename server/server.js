// Main server file - Run using node or nodemon

const express = require('express'); // Import express.js
const app = express(); 
const cors = require('cors');
const http = require('http').Server(app);
// const path = require('path');
const bodyParser = require('body-parser');

// Apply express middleware
app.use(cors()); // Enable CORS for all origins by default
app.use(bodyParser.json()); // Parse JSON bodies

// Routes
require('./routes/api-auth.js')(app); // Route for user api
require('./routes/api-group.js')(app); // Route for group api

// Listen file
const server = require('./listen.js');
const PORT = 3000;

// Start server listening for requests.
server.listen(http, PORT);
const { ObjectId } = require('mongodb');
const { updateStaticFile, readStaticFile } = require('../data/staticDataHandler');

module.exports = function (app, client) {
    const db = client.db('softwareFrameworks');
    const usersCollection = db.collection('users');

    // Route to handle user signup
    app.post('/api/auth/signup', async (req, res) => {
        try {
            const { firstName, lastName, username, email, password, dob } = req.body;
            
            // Check if the username already exists in the system
            // Uncomment the next line to read from static file instead of MongoDB
            // const users = await readStaticFile('users');
            // const userExists = users.find(user => user.username === username);
            const userExists = await usersCollection.findOne({ username });
            
            if (userExists) {
                return res.status(400).json({ error: 'Username is already taken' });
            }
            // Create a new user if the username is unique
            const newUser = {
                _id: new ObjectId(),
                firstName,
                lastName,
                username,
                email,
                password, // Storing password as plain text, as in the original code
                dob,
                roles: ['chat'], // Default role is 'chat'
                profileImg: 'assets/images/defaultProfile.jpg',
                status: 'Active',
            };
            // Add the new user to the users collection
            await usersCollection.insertOne(newUser);

            // Update static file
            const allUsers = await usersCollection.find({}).toArray();
            await updateStaticFile(allUsers, 'users');

            // Send back the new user's data (excluding the password)
            res.json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                roles: newUser.roles,
                profileImg: newUser.profileImg,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                dob: newUser.dob,
                status: newUser.status,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Route to handle user login
    app.post('/api/auth', async (req, res) => {
        try {
            const { username, password } = req.body;
            
            // Find the user with the matching username and password
            // Uncomment the next lines to read from static file instead of MongoDB
            // const users = await readStaticFile('users');
            // const user = users.find(u => u.username === username && u.password === password);
            const user = await usersCollection.findOne({ username, password });
            
            if (user) {
                // If credentials match, return the user data (excluding the password)
                res.json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: user.roles,
                    profileImg: user.profileImg,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dob: user.dob,
                    status: user.status,
                });
            } else {
                // If the credentials are invalid, return an error response
                res.status(401).json({ valid: false, message: 'Invalid credentials' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
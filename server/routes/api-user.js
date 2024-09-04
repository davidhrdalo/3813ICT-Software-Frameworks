// Used to store static account details
const { User, users, saveData } = require('../data/dataWrite');

module.exports = function (app) {
    // GET route to retrieve all users without exposing passwords
    app.get('/api/users', (req, res) => {
        const usersWithoutPassword = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            profileImg: user.profileImg,
            firstName: user.firstName,
            lastName: user.lastName,
            dob: user.dob,
            status: user.status,
        }));
        res.json(usersWithoutPassword);
    });

    // POST route to create a new user
    app.post('/api/users/create', (req, res) => {
        const { username, email, password } = req.body;

        // Check if the username already exists
        const userExists = users.some(user => user.username === username);

        if (userExists) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        // Create a new user if the username is unique
        const newUser = new User(
            Date.now(), // Unique ID using the current timestamp
            username,
            email,
            password,
            ['chat'], // Default role is 'chat'
            'assets/images/defaultProfile.jpg', // Default profile image
            '', // Empty first name
            '', // Empty last name
            '', // Empty date of birth
            'Active' // Default status
        );

        // Add the new user to the users array
        users.push(newUser);
        saveData({ users }); // Save the updated users array

        res.status(201).json(newUser); // Respond with the created user data
    });

    // DELETE route to delete a user by ID
    app.delete('/api/users/:id', (req, res) => {
        const userId = parseInt(req.params.id, 10);
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex !== -1) {
            users.splice(userIndex, 1); // Remove the user from the array
            saveData({ users }); // Save the updated users array
            res.status(204).send(); // Send no content response
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });

    // POST route to promote a user to Group Admin
    app.post('/api/users/:id/promote/group', (req, res) => {
        const userId = parseInt(req.params.id, 10);
        const user = users.find(u => u.id === userId);

        if (user) {
            if (Array.isArray(user.roles) && !user.roles.includes('group')) {
                user.roles.push('group'); // Add 'group' role if the user doesn't already have it
                saveData({ users }); // Save updated user data
                res.status(200).json(user); // Respond with updated user
            } else if (!Array.isArray(user.roles)) {
                res.status(500).json({ error: 'User roles is not an array' });
            } else {
                res.status(400).json({ error: 'User is already a Group Admin' });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });

    // POST route to promote a user to Super Admin
    app.post('/api/users/:id/promote/super', (req, res) => {
        const userId = parseInt(req.params.id, 10);
        const user = users.find(u => u.id === userId);

        if (user) {
            if (Array.isArray(user.roles) && !user.roles.includes('super')) {
                user.roles.push('super'); // Add 'super' role if the user doesn't already have it
                saveData({ users }); // Save updated user data
                res.status(200).json(user); // Respond with updated user
            } else if (!Array.isArray(user.roles)) {
                res.status(500).json({ error: 'User roles is not an array' });
            } else {
                res.status(400).json({ error: 'User is already a Super Admin' });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
};

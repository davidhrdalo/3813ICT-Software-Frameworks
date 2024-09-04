// Used to store static account details
const { User, users, saveData } = require('../data/seederData');

module.exports = function (app) {
    // New GET route to retrieve all users
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

        // If the username is unique, create a new user
        const newUser = new User(
            Date.now(),
            username,
            email,
            password,
            ['chat'], // Default roles
            'assets/images/defaultProfile.jpg', // Default profile image
            '', // Default empty first name
            '', // Default empty last name
            '', // Default empty dob
            'Active' // Default status
        );

        // Save the new user to the users array
        users.push(newUser);
        saveData({ users });

        // Send back the created user data
        res.status(201).json(newUser);
    });

    // DELETE route to delete a user by ID
    app.delete('/api/users/:id', (req, res) => {
        const userId = parseInt(req.params.id, 10);
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            saveData({ users });
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });

    // Promote user to Group Admin
    app.post('/api/users/:id/promote/group', (req, res) => {
        const userId = parseInt(req.params.id, 10);
        const user = users.find(u => u.id === userId);

        if (user) {
            if (Array.isArray(user.roles) && !user.roles.includes('group')) {
                user.roles.push('group');
                saveData({ users });
                res.status(200).json(user);
            } else if (!Array.isArray(user.roles)) {
                res.status(500).json({ error: 'User roles is not an array' });
            } else {
                res.status(400).json({ error: 'User is already a Group Admin' });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });

    // Promote user to Super Admin
    app.post('/api/users/:id/promote/super', (req, res) => {
        const userId = parseInt(req.params.id, 10);
        const user = users.find(u => u.id === userId);

        if (user) {
            if (Array.isArray(user.roles) && !user.roles.includes('super')) {
                user.roles.push('super');
                saveData({ users });
                res.status(200).json(user);
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

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
        const newUser = new User(
            Date.now(),
            username,
            email,
            password,
            'chat', // Default roles
            'assets/images/defaultProfile.jpg', // Default profile image
            '', // Default empty first name
            '', // Default empty last name
            '', // Default empty dob
            'Active' // Default status
        );
      
        // Save the new user to the users array
        users.push(newUser);
        saveData({ users });
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
};

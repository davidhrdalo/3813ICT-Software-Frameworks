const { ObjectId } = require('mongodb');

module.exports = function (app, client) {
    const db = client.db('softwareFrameworks');
    const usersCollection = db.collection('users');

    // GET route to retrieve all users without exposing passwords
    app.get('/api/users', async (req, res) => {
        try {
            const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // POST route to create a new user
    app.post('/api/users/create', async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Check if the username already exists
            const userExists = await usersCollection.findOne({ username });

            if (userExists) {
                return res.status(400).json({ error: 'Username is already taken' });
            }

            // Create a new user if the username is unique
            const newUser = {
                _id: new ObjectId(),
                username,
                email,
                password,
                roles: ['chat'], // Default role is 'chat'
                profileImg: 'assets/images/defaultProfile.jpg', // Default profile image
                firstName: '',
                lastName: '',
                dob: '',
                status: 'Active' // Default status
            };

            // Add the new user to the users collection
            await usersCollection.insertOne(newUser);

            res.status(201).json(newUser); // Respond with the created user data
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // DELETE route to delete a user by ID
    app.delete('/api/users/:id', async (req, res) => {
        try {
            const userId = new ObjectId(req.params.id);
            const result = await usersCollection.deleteOne({ _id: userId });

            if (result.deletedCount === 1) {
                res.status(204).send(); // Send no content response
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // POST route to promote a user to Group Admin
    app.post('/api/users/:id/promote/group', async (req, res) => {
        try {
            const userId = new ObjectId(req.params.id);
            const result = await usersCollection.findOneAndUpdate(
                { _id: userId, roles: { $ne: 'group' } },
                { $addToSet: { roles: 'group' } },
                { returnDocument: 'after' }
            );

            if (result.value) {
                res.status(200).json(result.value);
            } else {
                res.status(400).json({ error: 'User is already a Group Admin or not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // POST route to promote a user to Super Admin
    app.post('/api/users/:id/promote/super', async (req, res) => {
        try {
            const userId = new ObjectId(req.params.id);
            const result = await usersCollection.findOneAndUpdate(
                { _id: userId, roles: { $ne: 'super' } },
                { $addToSet: { roles: 'super' } },
                { returnDocument: 'after' }
            );

            if (result.value) {
                res.status(200).json(result.value);
            } else {
                res.status(400).json({ error: 'User is already a Super Admin or not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
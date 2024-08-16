// Used to store static account details

module.exports = function (app) {
    class User {
        constructor(id, username, email, password, roles = [], groups = []) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.password = password;
            this.roles = roles;
            this.groups = groups;
        }
    }

    const users = [
        new User(1, 'john_doe', 'john@example.com', 'password123', ['Super Admin'], ['group1', 'group2']),
        new User(2, 'jane_smith', 'jane@example.com', 'password456', ['Group Admin'], ['group1']),
        new User(3, 'alice_jones', 'alice@example.com', 'password789', ['Chat User'], ['group2'])
    ];

    app.post('/api/auth', (req, res) => {
        const { username, password } = req.body;
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            // Send back the user data excluding the password
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: user.roles,
                groups: user.groups
            });
        } else {
            res.status(401).json({ valid: false, message: 'Invalid credentials' });
        }
    });
};

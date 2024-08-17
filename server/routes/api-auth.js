// Used to store static account details

module.exports = function (app) {
    class User {
        constructor(id, username, email, password, role) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.password = password;
            this.role = role;
        }
    }

    const users = [
        new User(1, 'john_doe', 'john@example.com', 'password123', 'super'),
        new User(2, 'jane_smith', 'jane@example.com', 'password456', 'group'),
        new User(3, 'alice_jones', 'alice@example.com', 'password789', 'chat')
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
                role: user.role
            });
        } else {
            res.status(401).json({ valid: false, message: 'Invalid credentials' });
        }
    });
};

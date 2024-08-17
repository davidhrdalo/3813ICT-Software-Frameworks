// Used to store static account details

module.exports = function (app) {
    class User {
        constructor(id, username, email, password, role, profileImg, firstName, lastName, dob, status) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.password = password;
            this.role = role;
            this.profileImg = profileImg;
            this.firstName = firstName;
            this.lastName = lastName;
            this.dob = dob;
            this.status = status;
        }
    }

    const users = [
        new User(1, 'john_doe', 'john@example.com', 'password123', 'super', 'https://picsum.photos/200/300', 'John', 'Doe', '2001-08-17', 'Busy'),
        new User(2, 'jane_smith', 'jane@example.com', 'password456', 'group', 'https://picsum.photos/201/300', 'Jane', 'Smith', '2002-03-26', 'Available'),
        new User(3, 'alice_jones', 'alice@example.com', 'password789', 'chat', 'https://picsum.photos/202/300', 'Alice', 'Jones', '2020-06-10', 'Away')
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
                role: user.role,
                profileImg: user.profileImg,
                firstName: user.firstName,
                lastName: user.lastName,
                dob: user.dob,
                status: user.status,
            });
        } else {
            res.status(401).json({ valid: false, message: 'Invalid credentials' });
        }
    });
};

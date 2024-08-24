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
        new User(1, 'john_doe', 'john@example.com', 'pw', 'super', 'assets/images/37.jpg', 'John', 'Doe', '2001-08-17', 'Busy'),
        new User(2, 'jane_smith', 'jane@example.com', 'pw', 'group', 'assets/images/58.jpg', 'Jane', 'Smith', '2002-03-26', 'Available'),
        new User(3, 'alice_jones', 'alice@example.com', 'pw', 'chat', 'assets/images/430.jpg', 'Alice', 'Jones', '2020-06-10', 'Away')
    ];

    app.post('/api/auth/signup', (req, res) => {
        const { firstName, lastName, username, email, password, dob } = req.body;
        const newUser = {
          id: Date.now(),
          firstName,
          lastName,
          username,
          email,
          password,
          dob,
          role: 'chat',
          profileImg: 'assets/images/defaultProfile.jpg',
          status: 'Active',
        };
      
        // Save the new user to your users array or database
        users.push(newUser);
      
        // Send back the user data excluding the password
        res.json({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          profileImg: newUser.profileImg,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          dob: newUser.dob,
          status: newUser.status,
        });
      });
      

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

    // New GET route to retrieve all users
    app.get('/api/users', (req, res) => {
        const usersWithoutPassword = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            profileImg: user.profileImg,
            firstName: user.firstName,
            lastName: user.lastName,
            dob: user.dob,
            status: user.status,
        }));
        res.json(usersWithoutPassword);
    });
};

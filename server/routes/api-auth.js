// Used to store static account details
const { User, users } = require('../data/seederData');

module.exports = function (app) {
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
};

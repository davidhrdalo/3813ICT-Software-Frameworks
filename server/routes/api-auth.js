const { User, users } = require('../data/dataWrite');

module.exports = function (app) {

  // Route to handle user signup
  app.post('/api/auth/signup', (req, res) => {
    const { firstName, lastName, username, email, password, dob } = req.body;

    // Check if the username already exists in the system
    const userExists = users.some(user => user.username === username);

    if (userExists) {
      // Return an error response if the username is already taken
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Create a new user if the username is unique
    const newUser = {
      id: Date.now(), // Use the current timestamp as the user ID
      firstName,
      lastName,
      username,
      email,
      password, // For simplicity, the password is stored as plain text (not secure)
      dob,
      roles: 'chat', // Default role is 'chat'
      profileImg: 'assets/images/defaultProfile.jpg', // Assign a default profile image
      status: 'Active', // Set the initial status to 'Active'
    };

    // Add the new user to the users array
    users.push(newUser);

    // Send back the new user's data (excluding the password)
    res.json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      roles: newUser.roles,
      profileImg: newUser.profileImg,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      dob: newUser.dob,
      status: newUser.status,
    });
  });

  // Route to handle user login
  app.post('/api/auth', (req, res) => {
    const { username, password } = req.body;

    // Find the user with the matching username and password
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      // If credentials match, return the user data (excluding the password)
      res.json({
        id: user.id,
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
  });
};

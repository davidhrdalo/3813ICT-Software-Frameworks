// Used to store static account details
const { User, users } = require('../data/seederData');

module.exports = function (app) {
  app.post('/api/auth/signup', (req, res) => {
    const { firstName, lastName, username, email, password, dob } = req.body;
  
    // Check if the username already exists
    const userExists = users.some(user => user.username === username);
  
    if (userExists) {
      return res.status(400).json({ error: 'Username is already taken' });
    }
  
    // If username is unique, create a new user
    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      username,
      email,
      password,
      dob,
      roles: 'chat',
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
      roles: newUser.roles,
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
        roles: user.roles,
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

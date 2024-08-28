// Used to store static account details
const { User, users } = require('../data/seederData');

module.exports = function (app) {
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

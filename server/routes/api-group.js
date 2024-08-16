module.exports = function (app) {
    class Group {
        constructor(id, name, admins = [], members = []) {
            this.id = id;
            this.name = name;
            this.admins = admins;
            this.members = members;
        }
    }

    const groups = [
        new Group(1, 'group1', [1], [1, 2]), // Example group with Super Admin and Group Admin
        new Group(2, 'group2', [2], [1, 3]),  // Example group with Group Admin and Chat User
        new Group(3, 'group3', [2], [1, 2, 3])  // Example group with Group Admin and Chat User
    ];

    app.get('/api/groups', (req, res) => {
        res.json(groups);
    });
};

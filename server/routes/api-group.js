module.exports = function (app) {
    class Group {
        constructor(id, name, admins = [], members = [], description, groupImg) {
            this.id = id;
            this.name = name;
            this.admins = admins;
            this.members = members;
            this.description = description;
            this.groupImg = groupImg;
        }
    }

    const groups = [
        new Group(1, 'group1', [1], [1, 2], 'Desc1', 'assets/images/473.jpg'), // group with Super Admin and Group Admin
        new Group(2, 'group2', [2], [1, 3], 'Desc2', 'assets/images/475.jpg'),  // group with Group Admin and Chat User
        new Group(3, 'group3', [2], [1, 2, 3], 'Desc3', 'assets/images/550.jpg')  // group with Group Admin and Chat User
    ];

    app.get('/api/groups', (req, res) => {
        res.json(groups);
    });
};

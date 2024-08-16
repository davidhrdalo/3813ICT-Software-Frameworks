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
        new Group(1, 'group1', [1], [1, 2]), // Group1 with Super Admin and Group Admin
        new Group(2, 'group2', [2], [1, 3])  // Group2 with Group Admin and Chat User
    ];

    app.get('/api/groups', (req, res) => {
        res.json(groups);
    });

    app.post('/api/groups', (req, res) => {
        const { name, adminId } = req.body;

        // Create a new group
        const newGroup = new Group(groups.length + 1, name, [adminId]);
        groups.push(newGroup);

        res.json(newGroup);
    });

    app.post('/api/groups/:id/members', (req, res) => {
        const { userId } = req.body;
        const group = groups.find(g => g.id === parseInt(req.params.id));

        if (group) {
            group.members.push(userId);
            res.json(group);
        } else {
            res.status(404).json({ message: 'Group not found' });
        }
    });

    app.delete('/api/groups/:id', (req, res) => {
        const groupId = parseInt(req.params.id);
        const groupIndex = groups.findIndex(g => g.id === groupId);

        if (groupIndex !== -1) {
            groups.splice(groupIndex, 1);
            res.json({ message: 'Group deleted' });
        } else {
            res.status(404).json({ message: 'Group not found' });
        }
    });
};

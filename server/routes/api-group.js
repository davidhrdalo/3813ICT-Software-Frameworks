const { Group, groups, saveData } = require('../data/seederData');

module.exports = function (app) {
    app.get('/api/groups', (req, res) => {
        res.json(groups);
    });

    app.post('/api/groups', (req, res) => {
        const newGroup = new Group(
            req.body.id,
            req.body.name,
            req.body.admins,
            req.body.members,
            req.body.interested,
            req.body.description,
            req.body.groupImg
        );
        groups.push(newGroup);
        saveData({ groups }); // Save the updated groups array to the JSON file
        res.status(201).json(newGroup);
    });

    // Update group
    app.put('/api/groups/:id', (req, res) => {
        const groupId = parseInt(req.params.id, 10);
        const groupIndex = groups.findIndex(g => g.id === groupId);
        if (groupIndex !== -1) {
            const updatedGroup = Object.assign(groups[groupIndex], req.body);
            saveData({ groups });
            res.json(updatedGroup);
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    });

    // Delete group
    app.delete('/api/groups/:id', (req, res) => {
        const groupId = parseInt(req.params.id, 10);
        const groupIndex = groups.findIndex(g => g.id === groupId);
        if (groupIndex !== -1) {
            groups.splice(groupIndex, 1);
            saveData({ groups });
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    });

    app.post('/api/groups/:id/interested', (req, res) => {
        const groupId = parseInt(req.params.id, 10);
        const userId = req.body.userId;
        const group = groups.find(g => g.id === groupId);
        if (group) {
            if (!group.interested.includes(userId)) {
                group.interested.push(userId);
                saveData({ groups });
                res.status(200).json(group);
            } else {
                res.status(400).json({ error: 'User already registered interest in this group' });
            }
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    });

    // Remove interest route (new)
    app.post('/api/groups/:id/unregister-interest', (req, res) => {
        const groupId = parseInt(req.params.id, 10);
        const userId = req.body.userId;
        const group = groups.find(g => g.id === groupId);
        if (group) {
            const index = group.interested.indexOf(userId);
            if (index > -1) {
                group.interested.splice(index, 1);
                saveData({ groups });
                res.status(200).json(group);
            } else {
                res.status(400).json({ error: 'User has not registered interest in this group' });
            }
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    });

};

const { Group, groups, saveData } = require('../data/dataWrite');

module.exports = function (app) {

    // Get all groups
    app.get('/api/groups', (req, res) => {
        res.json(groups);
    });

    // Create a new group
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
        groups.push(newGroup); // Add new group to the array
        saveData({ groups }); // Save updated group data
        res.status(201).json(newGroup); // Respond with the created group
    });

    // Update a group by ID
    app.put('/api/groups/:id', (req, res) => {
        const groupId = parseInt(req.params.id, 10);
        const groupIndex = groups.findIndex(g => g.id === groupId);
        if (groupIndex !== -1) {
            const updatedGroup = Object.assign(groups[groupIndex], req.body); // Update group properties
            saveData({ groups }); // Save updated group data
            res.json(updatedGroup); // Respond with updated group
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    });

    // Delete a group by ID
    app.delete('/api/groups/:id', (req, res) => {
        const groupId = parseInt(req.params.id, 10);
        const groupIndex = groups.findIndex(g => g.id === groupId);
        if (groupIndex !== -1) {
            groups.splice(groupIndex, 1); // Remove group from array
            saveData({ groups }); // Save updated data
            res.status(204).send(); // No content response
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    });

    // Register interest in a group
    app.post('/api/groups/:id/interested', (req, res) => {
        const groupId = parseInt(req.params.id, 10);
        const userId = req.body.userId;
        const group = groups.find(g => g.id === groupId);
        if (group) {
            if (!group.interested.includes(userId)) {
                group.interested.push(userId); // Add user to interested list
                saveData({ groups }); // Save updated data
                res.status(200).json(group);
            } else {
                res.status(400).json({ error: 'User already registered interest in this group' });
            }
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    });

    // Unregister interest in a group
    app.post('/api/groups/:id/unregister-interest', (req, res) => {
        const groupId = parseInt(req.params.id, 10);
        const userId = req.body.userId;
        const group = groups.find(g => g.id === groupId);
        if (group) {
            const index = group.interested.indexOf(userId);
            if (index > -1) {
                group.interested.splice(index, 1); // Remove user from interested list
                saveData({ groups }); // Save updated data
                res.status(200).json(group);
            } else {
                res.status(400).json({ error: 'User has not registered interest in this group' });
            }
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    });

    // Remove a user from a group
    app.post('/api/groups/:groupId/removeUser', (req, res) => {
        const { groupId } = req.params;
        const { userId } = req.body;

        const group = groups.find(g => g.id === parseInt(groupId, 10));
        if (group) {
            group.members = group.members.filter(memberId => memberId !== userId); // Remove from members
            group.interested = group.interested.filter(interestId => interestId !== userId); // Remove from interested

            saveData({ groups }); // Save updated group data
            res.status(200).json(group);
        } else {
            res.status(404).json({ error: 'Group not found.' });
        }
    });

    // Allow a user to join a group
    app.post('/api/groups/:groupId/allowUserToJoin', (req, res) => {
        const { groupId } = req.params;
        const { userId } = req.body;

        const group = groups.find(g => g.id === parseInt(groupId, 10));
        if (group) {
            group.interested = group.interested.filter(interestId => interestId !== userId); // Remove from interested
            if (!group.members.includes(userId)) {
                group.members.push(userId); // Add to members if not already
            }

            saveData({ groups }); // Save updated group data
            res.status(200).json(group);
        } else {
            res.status(404).json({ error: 'Group not found.' });
        }
    });
};

const { ObjectId } = require('mongodb');

module.exports = function (app, client) {
    const db = client.db('softwareFrameworks');
    const groupsCollection = db.collection('groups');

    // Get all groups
    app.get('/api/groups', async (req, res) => {
        try {
            const groups = await groupsCollection.find({}).toArray();
            res.json(groups);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Create a new group
    app.post('/api/groups', async (req, res) => {
        try {
            const newGroup = {
                _id: new ObjectId(),
                name: req.body.name,
                admins: req.body.admins,
                members: req.body.members,
                interested: req.body.interested,
                description: req.body.description,
                groupImg: req.body.groupImg
            };
            const result = await groupsCollection.insertOne(newGroup);
            res.status(201).json(newGroup);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Update a group by ID
    app.put('/api/groups/:id', async (req, res) => {
        try {
            const groupId = new ObjectId(req.params.id);
            
            // Create a new object without the _id field
            const { _id, ...updateData } = req.body;

            const updatedGroup = await groupsCollection.findOneAndUpdate(
                { _id: groupId },
                { $set: updateData },
                { returnDocument: 'after' }
            );

            if (updatedGroup.value) {
                res.status(200).json(updatedGroup.value);
            } else {
                const group = await groupsCollection.findOne({ _id: groupId });
                if (group) {
                    res.status(200).json(group); // Group exists but no changes were made
                } else {
                    res.status(404).json({ error: 'Group not found' });
                }
            }
        } catch (error) {
            console.error('Error updating group:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Delete a group by ID
    app.delete('/api/groups/:id', async (req, res) => {
        try {
            const groupId = new ObjectId(req.params.id);
            const result = await groupsCollection.deleteOne({ _id: groupId });
            if (result.deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Group not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Register interest in a group
    app.post('/api/groups/:id/interested', async (req, res) => {
        try {
            const groupId = new ObjectId(req.params.id);
            const userId = req.body.userId;
            const result = await groupsCollection.findOneAndUpdate(
                { _id: groupId, interested: { $ne: userId } },
                { $addToSet: { interested: userId } },
                { returnDocument: 'after' }
            );
            if (result.value) {
                res.json(result.value);
            } else {
                res.status(400).json({ error: 'User already registered interest or group not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Unregister interest in a group
    app.post('/api/groups/:id/unregister-interest', async (req, res) => {
        try {
            const groupId = new ObjectId(req.params.id);
            const userId = req.body.userId;
            const result = await groupsCollection.findOneAndUpdate(
                { _id: groupId },
                { $pull: { interested: userId } },
                { returnDocument: 'after' }
            );
            if (result.value) {
                res.json(result.value);
            } else {
                res.status(404).json({ error: 'Group not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Remove a user from a group
    app.post('/api/groups/:groupId/removeUser', async (req, res) => {
        try {
            const groupId = new ObjectId(req.params.groupId);
            const userId = req.body.userId;
            const result = await groupsCollection.findOneAndUpdate(
                { _id: groupId },
                { $pull: { members: userId, interested: userId } },
                { returnDocument: 'after' }
            );
            if (result.value) {
                res.json(result.value);
            } else {
                res.status(404).json({ error: 'Group not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Allow a user to join a group
    app.post('/api/groups/:groupId/allowUserToJoin', async (req, res) => {
        try {
            const groupId = new ObjectId(req.params.groupId);
            const userId = req.body.userId;
            const result = await groupsCollection.findOneAndUpdate(
                { _id: groupId },
                { 
                    $pull: { interested: userId },
                    $addToSet: { members: userId }
                },
                { returnDocument: 'after' }
            );
            if (result.value) {
                res.json(result.value);
            } else {
                res.status(404).json({ error: 'Group not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
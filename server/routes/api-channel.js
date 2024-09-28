const { ObjectId } = require('mongodb');

module.exports = function (app, client) {
    const db = client.db('softwareFrameworks');
    const channelsCollection = db.collection('channels');

    // Get all channels and return as JSON
    app.get('/api/channels', async (req, res) => {
        try {
            const channels = await channelsCollection.find({}).toArray();
            res.json(channels);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Create a new channel and add it to the channels collection
    app.post('/api/channels', async (req, res) => {
        try {
            const { name, description, groupId } = req.body;
            const newChannel = {
                _id: new ObjectId(),
                name,
                groupId: new ObjectId(groupId),
                description,
                members: []
            };
            const result = await channelsCollection.insertOne(newChannel);
            res.status(201).json(newChannel);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Delete a channel by ID if it exists
    app.delete('/api/channels/:id', async (req, res) => {
        try {
            const channelId = new ObjectId(req.params.id);
            const result = await channelsCollection.deleteOne({ _id: channelId });
            if (result.deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Channel not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Update an existing channel by ID
    app.put('/api/channels/:id', async (req, res) => {
        try {
            const channelId = new ObjectId(req.params.id);
            const result = await channelsCollection.findOneAndUpdate(
                { _id: channelId },
                { $set: req.body },
                { returnDocument: 'after' }
            );
            if (result.value) {
                res.json(result.value);
            } else {
                res.status(404).json({ error: 'Channel not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Add a user to a channel by channel ID
    app.post('/api/channels/:id/addMember', async (req, res) => {
        try {
            const channelId = new ObjectId(req.params.id);
            const { userId } = req.body;
            const result = await channelsCollection.findOneAndUpdate(
                { _id: channelId, members: { $ne: userId } },
                { $addToSet: { members: userId } },
                { returnDocument: 'after' }
            );
            if (result.value) {
                res.status(200).json(result.value);
            } else {
                res.status(400).json({ error: 'User is already a member or channel not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Remove a user from a channel by channel ID
    app.post('/api/channels/:id/removeMember', async (req, res) => {
        try {
            const channelId = new ObjectId(req.params.id);
            const { userId } = req.body;
            const result = await channelsCollection.findOneAndUpdate(
                { _id: channelId },
                { $pull: { members: userId } },
                { returnDocument: 'after' }
            );
            if (result.value) {
                res.status(200).json(result.value);
            } else {
                res.status(400).json({ error: 'User is not a member or channel not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
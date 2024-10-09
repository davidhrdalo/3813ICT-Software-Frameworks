const { ObjectId } = require('mongodb');
const { updateStaticFile, readStaticFile } = require('../data/staticDataHandler');

module.exports = function (app, client) {
    const db = client.db('softwareFrameworks');
    const channelsCollection = db.collection('channels');

    // Get all channels and return as JSON
    app.get('/api/channels', async (req, res) => {
        try {
            const channels = await channelsCollection.find({}).toArray();
            // Uncomment the next line to read from static file instead of MongoDB
            // const channels = await readStaticFile('channels');
            res.status(200).json(channels);
        } catch (error) {
            console.error('Error fetching channels:', error);
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
            if (result.insertedId) {
                // Update static file
                const allChannels = await channelsCollection.find({}).toArray();
                await updateStaticFile(allChannels, 'channels');
                res.status(201).json(newChannel);
            } else {
                res.status(400).json({ error: 'Failed to create channel' });
            }
        } catch (error) {
            console.error('Error creating channel:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Delete a channel by ID if it exists
    app.delete('/api/channels/:id', async (req, res) => {
        try {
            const channelId = new ObjectId(req.params.id);
            const result = await channelsCollection.deleteOne({ _id: channelId });
            if (result.deletedCount === 1) {
                // Update static file
                const allChannels = await channelsCollection.find({}).toArray();
                await updateStaticFile(allChannels, 'channels');
                res.status(200).json({ message: 'Channel deleted successfully' });
            } else {
                res.status(404).json({ error: 'Channel not found' });
            }
        } catch (error) {
            console.error('Error deleting channel:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Update an existing channel by ID
    app.put('/api/channels/:id', async (req, res) => {
        try {
            const channelId = new ObjectId(req.params.id);
            const { _id, ...updateData } = req.body; // Remove _id from update data
            const result = await channelsCollection.findOneAndUpdate(
                { _id: channelId },
                { $set: updateData },
                { returnDocument: 'after' }
            );
            if (result.value) {
                // Update static file
                const allChannels = await channelsCollection.find({}).toArray();
                await updateStaticFile(allChannels, 'channels');
                res.status(200).json(result.value);
            } else {
                const channel = await channelsCollection.findOne({ _id: channelId });
                if (channel) {
                    res.status(200).json(channel); // Channel exists but no changes were made
                } else {
                    res.status(404).json({ error: 'Channel not found' });
                }
            }
        } catch (error) {
            console.error('Error updating channel:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Add a user to a channel by channel ID
    app.post('/api/channels/:id/addMember', async (req, res) => {
        try {
            const channelId = new ObjectId(req.params.id);
            const { userId } = req.body;
            const result = await channelsCollection.findOneAndUpdate(
                { _id: channelId },
                { $addToSet: { members: userId } },
                { returnDocument: 'after' }
            );
            if (result.value) {
                // Update static file
                const allChannels = await channelsCollection.find({}).toArray();
                await updateStaticFile(allChannels, 'channels');
                res.status(200).json(result.value);
            } else {
                const channel = await channelsCollection.findOne({ _id: channelId });
                if (channel) {
                    if (channel.members.includes(userId)) {
                        res.status(200).json(channel); // User already a member
                    } else {
                        res.status(400).json({ error: 'Failed to add user to channel' });
                    }
                } else {
                    res.status(404).json({ error: 'Channel not found' });
                }
            }
        } catch (error) {
            console.error('Error adding member to channel:', error);
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
                // Update static file
                const allChannels = await channelsCollection.find({}).toArray();
                await updateStaticFile(allChannels, 'channels');
                res.status(200).json(result.value);
            } else {
                const channel = await channelsCollection.findOne({ _id: channelId });
                if (channel) {
                    res.status(200).json(channel); // Channel exists but user wasn't a member
                } else {
                    res.status(404).json({ error: 'Channel not found' });
                }
            }
        } catch (error) {
            console.error('Error removing member from channel:', error);
            res.status(500).json({ error: error.message });
        }
    });
};
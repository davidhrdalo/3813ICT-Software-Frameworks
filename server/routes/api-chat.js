const { ObjectId } = require('mongodb');
const { updateStaticFile, readStaticFile } = require('../data/staticDataHandler');

module.exports = function (app, client) {
    const db = client.db('softwareFrameworks');
    const chatsCollection = db.collection('chats');

    // Get chat messages for a specific channel
    app.get('/api/chat/:channelId', async (req, res) => {
        try {
            const channelId = new ObjectId(req.params.channelId);
            const messages = await chatsCollection.find({ channelId: channelId })
                                                  .sort({ timestamp: 1 })
                                                  .limit(100)  // Limit to last 100 messages
                                                  .toArray();

            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching chat messages:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Post a new chat message
    app.post('/api/chat/:channelId', async (req, res) => {
        try {
            const channelId = new ObjectId(req.params.channelId);
            const { userId, username, message, profilePic } = req.body;

            const newMessage = {
                channelId: channelId,
                userId: new ObjectId(userId),
                username: username,
                message: message,
                profilePic: profilePic,
                timestamp: new Date()
            };

            const result = await chatsCollection.insertOne(newMessage);

            if (result.insertedId) {
                res.status(201).json(newMessage);
            } else {
                res.status(400).json({ error: 'Failed to insert message' });
            }
        } catch (error) {
            console.error('Error posting chat message:', error);
            res.status(500).json({ error: error.message });
        }
    });
};
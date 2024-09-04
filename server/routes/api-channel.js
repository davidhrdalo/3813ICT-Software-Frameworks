const { Channel, channels, saveData } = require('../data/dataWrite');

module.exports = function (app) {
    app.get('/api/channels', (req, res) => {
        res.json(channels);
    });

    app.post('/api/channels', (req, res) => {
        const { name, description, groupId } = req.body;
        const newChannel = new Channel(
            Date.now(),
            name,
            groupId,
            description,
            []
        );
        channels.push(newChannel);
        saveData({ channels });
        res.status(201).json(newChannel);
    });


    app.delete('/api/channels/:id', (req, res) => {
        const channelId = parseInt(req.params.id, 10);
        const channelIndex = channels.findIndex(c => c.id === channelId);
        if (channelIndex !== -1) {
            channels.splice(channelIndex, 1);
            saveData({ channels });
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Channel not found' });
        }
    });

    // Update channel
    app.put('/api/channels/:id', (req, res) => {
        const channelId = parseInt(req.params.id, 10);
        const channelIndex = channels.findIndex(c => c.id === channelId);
        if (channelIndex !== -1) {
            channels[channelIndex] = { ...channels[channelIndex], ...req.body };
            saveData({ channels });
            res.json(channels[channelIndex]);
        } else {
            res.status(404).json({ error: 'Channel not found' });
        }
    });

    // Add a user to a channel
    app.post('/api/channels/:id/addMember', (req, res) => {
        const channelId = parseInt(req.params.id, 10);
        const { userId } = req.body;
        const channel = channels.find(c => c.id === channelId);

        if (channel && !channel.members.includes(userId)) {
            channel.members.push(userId);
            saveData({ channels });
            res.status(200).json(channel);
        } else {
            res.status(400).json({ error: 'User is already a member or channel not found' });
        }
    });

    // Remove a user from a channel
    app.post('/api/channels/:id/removeMember', (req, res) => {
        const channelId = parseInt(req.params.id, 10);
        const { userId } = req.body;
        const channel = channels.find(c => c.id === channelId);

        if (channel && channel.members.includes(userId)) {
            channel.members = channel.members.filter(id => id !== userId);
            saveData({ channels });
            res.status(200).json(channel);
        } else {
            res.status(400).json({ error: 'User is not a member or channel not found' });
        }
    });
};

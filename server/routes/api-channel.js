const { Channel, channels, saveData } = require('../data/seederData');

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
            description
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
};

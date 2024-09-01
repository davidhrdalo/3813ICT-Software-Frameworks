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
};

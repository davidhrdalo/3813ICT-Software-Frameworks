module.exports = function (app) {
    class Channel {
        constructor(id, name, groupId) {
            this.id = id;
            this.name = name;
            this.groupId = groupId;
        }
    }

    const channels = [
        new Channel(1, 'channel1', 1),
        new Channel(2, 'channel2', 1),
        new Channel(3, 'channel3', 1),
        new Channel(4, 'channel3', 1),
        new Channel(5, 'channel3', 1),
        new Channel(6, 'channel3', 1),
    ];

    app.get('/api/channels', (req, res) => {
        res.json(channels);
    });
};

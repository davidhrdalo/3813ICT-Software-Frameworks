module.exports = function (app) {
    class Channel {
        constructor(id, name, groupId, description) {
            this.id = id;
            this.name = name;
            this.groupId = groupId;
            this.description = description;
        }
    }

    const channels = [
        new Channel(1, 'channel1', 1, 'Lets chat about cats!'),
        new Channel(2, 'channel2', 1, 'Lets chat about dogs!'),
        new Channel(3, 'channel3', 1, 'Lets chat about lions!'),
        new Channel(4, 'channel3', 1, 'Lets chat about people!'),
        new Channel(5, 'channel3', 1, 'Lets not chats!'),
        new Channel(6, 'channel3', 1, 'Hi.'),
    ];

    app.get('/api/channels', (req, res) => {
        res.json(channels);
    });
};

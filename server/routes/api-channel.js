const { Channel, channels } = require('../data/seederData');

module.exports = function (app) {
    app.get('/api/channels', (req, res) => {
        res.json(channels);
    });
};

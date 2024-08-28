const { Group, groups } = require('../data/seederData');

module.exports = function (app) {
    app.get('/api/groups', (req, res) => {
        res.json(groups);
    });
};

const { Channel, channels, saveData } = require('../data/dataWrite');

module.exports = function (app) {
    // Get all channels and return as JSON
    app.get('/api/channels', (req, res) => {
        res.json(channels); // Respond with the full list of channels
    });

    // Create a new channel and add it to the channels array
    app.post('/api/channels', (req, res) => {
        const { name, description, groupId } = req.body; // Extract channel details from the request body
        const newChannel = new Channel(
            Date.now(), // Generate a unique ID based on the current timestamp
            name,
            groupId,
            description,
            [] // Start with an empty members array
        );
        channels.push(newChannel); // Add the new channel to the channels array
        saveData({ channels }); // Save updated channel data
        res.status(201).json(newChannel); // Respond with the newly created channel
    });

    // Delete a channel by ID if it exists
    app.delete('/api/channels/:id', (req, res) => {
        const channelId = parseInt(req.params.id, 10); // Get the channel ID from URL params
        const channelIndex = channels.findIndex(c => c.id === channelId); // Find the index of the channel
        if (channelIndex !== -1) { // If the channel exists
            channels.splice(channelIndex, 1); // Remove the channel from the array
            saveData({ channels }); // Save the updated channels array
            res.status(204).send(); // Send a no-content response
        } else {
            res.status(404).json({ error: 'Channel not found' }); // Channel not found, send 404
        }
    });

    // Update an existing channel by ID
    app.put('/api/channels/:id', (req, res) => {
        const channelId = parseInt(req.params.id, 10); // Get the channel ID from URL params
        const channelIndex = channels.findIndex(c => c.id === channelId); // Find the channel
        if (channelIndex !== -1) { // If the channel exists
            channels[channelIndex] = { ...channels[channelIndex], ...req.body }; // Update channel with new data
            saveData({ channels }); // Save the changes
            res.json(channels[channelIndex]); // Respond with the updated channel
        } else {
            res.status(404).json({ error: 'Channel not found' }); // If not found, respond with 404
        }
    });

    // Add a user to a channel by channel ID
    app.post('/api/channels/:id/addMember', (req, res) => {
        const channelId = parseInt(req.params.id, 10); // Get the channel ID from URL params
        const { userId } = req.body; // Extract userId from the request body
        const channel = channels.find(c => c.id === channelId); // Find the channel

        if (channel && !channel.members.includes(userId)) { // If channel exists and user is not a member
            channel.members.push(userId); // Add the user to the channel
            saveData({ channels }); // Save the updated channels array
            res.status(200).json(channel); // Respond with the updated channel
        } else {
            res.status(400).json({ error: 'User is already a member or channel not found' }); // Error response
        }
    });

    // Remove a user from a channel by channel ID
    app.post('/api/channels/:id/removeMember', (req, res) => {
        const channelId = parseInt(req.params.id, 10); // Get the channel ID from URL params
        const { userId } = req.body; // Extract userId from the request body
        const channel = channels.find(c => c.id === channelId); // Find the channel

        if (channel && channel.members.includes(userId)) { // If channel exists and user is a member
            channel.members = channel.members.filter(id => id !== userId); // Remove the user from the members array
            saveData({ channels }); // Save the updated channels array
            res.status(200).json(channel); // Respond with the updated channel
        } else {
            res.status(400).json({ error: 'User is not a member or channel not found' }); // Error response
        }
    });
};

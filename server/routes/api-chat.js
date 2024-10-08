const { ObjectId } = require('mongodb');
const { updateStaticFile, readStaticFile } = require('../data/staticDataHandler');

module.exports = function (app, client, formidable, fs, path) {
    const db = client.db('softwareFrameworks');
    const chatsCollection = db.collection('chats');
    const baseUrl = 'http://localhost:3000'; // Used for image URLs

    // Get chat messages for a specific channel
    app.get('/api/chat/:channelId', async (req, res) => {
        try {
            const channelId = new ObjectId(req.params.channelId);
            const messages = await chatsCollection.find({ 
                channelId: channelId,
                $or: [
                    { message: { $exists: true } },
                    { eventType: { $in: ['join', 'leave'] } }
                ]
            })
            .sort({ timestamp: 1 })
            .limit(100)
            .toArray();
    
            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching chat history:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Post a new chat message
    app.post('/api/chat/:channelId', async (req, res) => {
        try {
            const channelId = new ObjectId(req.params.channelId);
            const { userId, username, message, profilePic, imageUrl } = req.body;

            const newMessage = {
                channelId: channelId,
                userId: new ObjectId(userId),
                username: username,
                message: message,
                profilePic: profilePic,
                imageUrl: imageUrl || null, // Include imageUrl if present
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

    app.post('/api/chat/:channelId/upload', (req, res) => {
        const form = new formidable.IncomingForm();
        const uploadFolder = path.join(__dirname, "../data/images/chatImages");
        form.uploadDir = uploadFolder;
        form.keepExtensions = true;

        form.parse(req, async (err, fields, files) => {
            // ... [existing error handling code] ...

            const uploadedFile = files.file[0];
            const oldPath = uploadedFile.filepath;
            const fileName = Date.now() + '_' + uploadedFile.originalFilename;
            const newPath = path.join(uploadFolder, fileName);

            try {
                await fs.promises.rename(oldPath, newPath);

                const channelId = new ObjectId(req.params.channelId);
                const imageUrl = `${baseUrl}/data/images/chatImages/${fileName}`;

                // Instead of creating a new message here, just return the imageUrl
                res.status(200).json({
                    result: 'OK',
                    data: { 'filename': fileName, 'size': uploadedFile.size, 'url': imageUrl },
                    message: "Image upload successful"
                });

            } catch (error) {
                console.error("Error saving the image:", error);
                res.status(500).json({
                    status: "Fail",
                    message: "Failed to save the image",
                    error: error.message,
                });
            }
        });
    });
};
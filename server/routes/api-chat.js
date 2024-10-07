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
            if (err) {
                console.error("Error parsing the files:", err);
                return res.status(400).json({
                    status: "Fail",
                    message: "There was an error parsing the files",
                    error: err.message,
                });
            }

            console.log('Files:', JSON.stringify(files, null, 2));

            if (!files.file || !Array.isArray(files.file) || files.file.length === 0) {
                return res.status(400).json({
                    status: "Fail",
                    message: "No image file uploaded or filename is missing",
                });
            }

            const uploadedFile = files.file[0];
            const oldPath = uploadedFile.filepath;
            const fileName = Date.now() + '_' + uploadedFile.originalFilename; // To ensure unique filenames
            const newPath = path.join(uploadFolder, fileName);

            try {
                await fs.promises.rename(oldPath, newPath);

                const channelId = req.params.channelId;
                console.log('Received channelId:', channelId);

                if (!ObjectId.isValid(channelId)) {
                    return res.status(400).json({
                        status: "Fail",
                        message: "Invalid channel ID",
                    });
                }

                const channelObjectId = new ObjectId(channelId);
                console.log('Converted channelObjectId:', channelObjectId);

                const imageUrl = `${baseUrl}/data/images/chatImages/${fileName}`;

                // Here, instead of updating a document, we'll create a new chat message
                // with the image URL. You might want to adjust this based on your exact requirements.
                const newMessage = {
                    channelId: channelObjectId,
                    imageUrl: imageUrl,
                    timestamp: new Date()
                    // Add any other necessary fields here
                };

                const insertResult = await chatsCollection.insertOne(newMessage);
                console.log('Insert Result:', insertResult);

                if (insertResult.insertedId) {
                    // Send success response with the image URL
                    res.status(200).json({
                        result: 'OK',
                        data: { 'filename': fileName, 'size': uploadedFile.size, 'url': imageUrl },
                        message: "Image upload and chat message creation successful"
                    });
                } else {
                    res.status(400).json({
                        status: "Fail",
                        message: "Failed to insert chat message with image"
                    });
                }

            } catch (error) {
                console.error("Error saving the image or creating chat message:", error);
                res.status(500).json({
                    status: "Fail",
                    message: "Failed to save the image or create chat message",
                    error: error.message,
                });
            }
        });
    });
};
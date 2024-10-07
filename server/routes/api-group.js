const { ObjectId } = require('mongodb');
const { updateStaticFile, readStaticFile } = require('../data/staticDataHandler');

module.exports = function (app, client, formidable, fs, path) {
    const db = client.db('softwareFrameworks');
    const groupsCollection = db.collection('groups');
    const baseUrl = 'http://localhost:3000'; // Used for img upload

    // Get all groups
    app.get('/api/groups', async (req, res) => {
        try {
            const groups = await groupsCollection.find({}).toArray();
            // Uncomment the next line to read from static file instead of MongoDB
            // const groups = await readStaticFile();
            res.json(groups);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Create a new group
    app.post('/api/groups', async (req, res) => {
        try {
            const newGroup = {
                _id: new ObjectId(),
                name: req.body.name,
                admins: req.body.admins,
                members: req.body.members,
                interested: req.body.interested,
                description: req.body.description,
                groupImg: req.body.groupImg
            };
            const result = await groupsCollection.insertOne(newGroup);
            // Update static file
            const allGroups = await groupsCollection.find({}).toArray();
            await updateStaticFile(allGroups, 'groups');
            res.status(201).json(newGroup);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Update a group by ID
    app.put('/api/groups/:id', async (req, res) => {
        try {
            const groupId = new ObjectId(req.params.id);

            // Create a new object without the _id field
            const { _id, ...updateData } = req.body;

            const updatedGroup = await groupsCollection.findOneAndUpdate(
                { _id: groupId },
                { $set: updateData },
                { returnDocument: 'after' }
            );

            if (updatedGroup.value) {
                // Update static file
                const allGroups = await groupsCollection.find({}).toArray();
                await updateStaticFile(allGroups, 'groups');
                res.status(200).json(updatedGroup.value);
            } else {
                const group = await groupsCollection.findOne({ _id: groupId });
                if (group) {
                    res.status(200).json(group); // Group exists but no changes were made
                } else {
                    res.status(404).json({ error: 'Group not found' });
                }
            }
        } catch (error) {
            console.error('Error updating group:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Delete a group by ID
    app.delete('/api/groups/:id', async (req, res) => {
        try {
            const groupId = new ObjectId(req.params.id);
            const result = await groupsCollection.deleteOne({ _id: groupId });
            if (result.deletedCount === 1) {
                // Update static file
                const allGroups = await groupsCollection.find({}).toArray();
                await updateStaticFile(allGroups, 'groups');
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Group not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Register interest in a group
    app.post('/api/groups/:id/interested', async (req, res) => {
        try {
            const groupId = new ObjectId(req.params.id);
            const userId = req.body.userId;
            const result = await groupsCollection.findOneAndUpdate(
                { _id: groupId, interested: { $ne: userId } },
                { $addToSet: { interested: userId } },
                { returnDocument: 'after' }
            );
            if (result.value) {
                // Update static file
                const allGroups = await groupsCollection.find({}).toArray();
                await updateStaticFile(allGroups, 'groups');
                res.json(result.value);
            } else {
                res.status(400).json({ error: 'User already registered interest or group not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Unregister interest in a group
    app.post('/api/groups/:id/unregister-interest', async (req, res) => {
        try {
            const groupId = new ObjectId(req.params.id);
            const userId = req.body.userId;
            const result = await groupsCollection.findOneAndUpdate(
                { _id: groupId },
                { $pull: { interested: userId } },
                { returnDocument: 'after' }
            );
            if (result.value) {
                // Update static file
                const allGroups = await groupsCollection.find({}).toArray();
                await updateStaticFile(allGroups, 'groups');
                res.json(result.value);
            } else {
                res.status(404).json({ error: 'Group not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Remove a user from a group
    app.post('/api/groups/:groupId/removeUser', async (req, res) => {
        try {
            const groupId = new ObjectId(req.params.groupId);
            const userId = req.body.userId;
            const result = await groupsCollection.findOneAndUpdate(
                { _id: groupId },
                { $pull: { members: userId, interested: userId } },
                { returnDocument: 'after' }
            );
            if (result.value) {
                // Update static file
                const allGroups = await groupsCollection.find({}).toArray();
                await updateStaticFile(allGroups, 'groups');
                res.json(result.value);
            } else {
                res.status(404).json({ error: 'Group not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Allow a user to join a group
    app.post('/api/groups/:groupId/allowUserToJoin', async (req, res) => {
        try {
            const groupId = new ObjectId(req.params.groupId);
            const userId = req.body.userId;
            const result = await groupsCollection.findOneAndUpdate(
                { _id: groupId },
                {
                    $pull: { interested: userId },
                    $addToSet: { members: userId }
                },
                { returnDocument: 'after' }
            );
            if (result.value) {
                // Update static file
                const allGroups = await groupsCollection.find({}).toArray();
                await updateStaticFile(allGroups, 'groups');
                res.json(result.value);
            } else {
                res.status(404).json({ error: 'Group not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post('/api/groups/:groupId/upload', (req, res) => {
        const form = new formidable.IncomingForm();
        const uploadFolder = path.join(__dirname, "../data/images/groupImages");
        form.uploadDir = uploadFolder;
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log("Error parsing the files:", err);
                return res.status(400).json({
                    status: "Fail",
                    message: "There was an error parsing the files",
                    error: err.message,
                });
            }
            console.log('Files:', JSON.stringify(files, null, 2));
            if (!files.image || !Array.isArray(files.image) || files.image.length === 0) {
                return res.status(400).json({
                    status: "Fail",
                    message: "No image file uploaded or filename is missing",
                });
            }
            const uploadedFile = files.image[0];
            const oldpath = uploadedFile.filepath;
            const newpath = path.join(uploadFolder, uploadedFile.originalFilename);
            try {
                await fs.promises.rename(oldpath, newpath);
                const groupId = req.params.groupId;
                console.log('Received groupId:', groupId);
                if (!ObjectId.isValid(groupId)) {
                    return res.status(400).json({
                        status: "Fail",
                        message: "Invalid group ID",
                    });
                }
                const groupObjectId = new ObjectId(groupId);
                console.log('Converted groupObjectId:', groupObjectId);
                const groupImgPath = `${baseUrl}/data/images/groupImages/${uploadedFile.originalFilename}`;
                const updateResult = await groupsCollection.updateOne(
                    { _id: groupObjectId },
                    { $set: { groupImg: groupImgPath } }
                );
                console.log('Update Result:', updateResult);
                if (updateResult.matchedCount === 0) {
                    console.log("No documents matched the query");
                    return res.status(404).json({
                        status: "Fail",
                        message: "Group not found",
                    });
                } else if (updateResult.modifiedCount === 0) {
                    console.log("Document matched but not modified");
                    res.status(200).json({
                        result: 'OK',
                        message: "Group image is already up to date"
                    });
                } else {
                    // Update static file if needed
                    const allGroups = await groupsCollection.find({}).toArray();
                    await updateStaticFile(allGroups, 'groups');
                    // Send success response
                    res.status(200).json({
                        result: 'OK',
                        data: { 'filename': uploadedFile.originalFilename, 'size': uploadedFile.size, 'url': groupImgPath },
                        message: "Upload and group image update successful"
                    });
                }
            } catch (error) {
                console.log("Error updating group image:", error);
                res.status(500).json({
                    status: "Fail",
                    message: "Failed to update group image",
                    error: error.message,
                });
            }
        });
    });
};
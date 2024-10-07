const { ObjectId } = require('mongodb');
const { updateStaticFile, readStaticFile } = require('../data/staticDataHandler');

module.exports = function (app, client, formidable, fs, path) {
    const db = client.db('softwareFrameworks');
    const usersCollection = db.collection('users');
    const baseUrl = 'http://localhost:3000'; // Used for img upload

    // GET route to retrieve all users without exposing passwords
    app.get('/api/users', async (req, res) => {
        try {
            const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
            // Uncomment the next line to read from static file instead of MongoDB
            // const users = await readStaticFile();
            res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // POST route to create a new user
    app.post('/api/users/create', async (req, res) => {
        try {
            const { username, email, password } = req.body;

            const userExists = await usersCollection.findOne({ username });
            if (userExists) {
                return res.status(400).json({ error: 'Username is already taken' });
            }

            const newUser = {
                _id: new ObjectId(),
                username,
                email,
                password,
                roles: ['chat'],
                profileImg: 'assets/images/defaultProfile.jpg',
                firstName: '',
                lastName: '',
                dob: '',
                status: 'Active'
            };

            const result = await usersCollection.insertOne(newUser);
            if (result.insertedId) {
                // Update static file
                const allUsers = await usersCollection.find({}).toArray();
                await updateStaticFile(allUsers, 'users');
                res.status(201).json(newUser);
            } else {
                res.status(500).json({ error: 'Failed to create user' });
            }
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // DELETE route to delete a user by ID
    app.delete('/api/users/:id', async (req, res) => {
        try {
            const userId = new ObjectId(req.params.id);
            const result = await usersCollection.deleteOne({ _id: userId });

            if (result.deletedCount === 1) {
                // Update static file
                const allUsers = await usersCollection.find({}).toArray();
                await updateStaticFile(allUsers, 'users');
                res.status(200).json({ message: 'User deleted successfully' });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // POST route to promote a user to Group Admin
    app.post('/api/users/:id/promote/group', async (req, res) => {
        try {
            const userId = new ObjectId(req.params.id);
            const result = await usersCollection.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { roles: 'group' } },
                { returnDocument: 'after' }
            );

            if (result.value) {
                // Update static file
                const allUsers = await usersCollection.find({}).toArray();
                await updateStaticFile(allUsers, 'users');
                res.status(200).json(result.value);
            } else {
                const user = await usersCollection.findOne({ _id: userId });
                if (user && user.roles.includes('group')) {
                    res.status(200).json(user);
                } else {
                    res.status(404).json({ error: 'User not found' });
                }
            }
        } catch (error) {
            console.error('Error in promote to group admin:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // POST route to promote a user to Super Admin
    app.post('/api/users/:id/promote/super', async (req, res) => {
        try {
            const userId = new ObjectId(req.params.id);
            const result = await usersCollection.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { roles: 'super' } },
                { returnDocument: 'after' }
            );

            if (result.value) {
                // Update static file
                const allUsers = await usersCollection.find({}).toArray();
                await updateStaticFile(allUsers, 'users');
                res.status(200).json(result.value);
            } else {
                const user = await usersCollection.findOne({ _id: userId });
                if (user && user.roles.includes('super')) {
                    res.status(200).json(user);
                } else {
                    res.status(404).json({ error: 'User not found' });
                }
            }
        } catch (error) {
            console.error('Error in promote to super admin:', error);
            res.status(500).json({ error: error.message });
        }
    });

    app.post('/api/users/:id/upload', (req, res) => {
        const form = new formidable.IncomingForm();
        const uploadFolder = path.join(__dirname, "../data/images/profileImages");
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
                const userId = req.params.id;
                console.log('Received userId:', userId);
                if (!ObjectId.isValid(userId)) {
                    return res.status(400).json({
                        status: "Fail",
                        message: "Invalid user ID",
                    });
                }
                const userObjectId = new ObjectId(userId);
                console.log('Converted userObjectId:', userObjectId);
                const profileImgPath = `${baseUrl}/data/images/profileImages/${uploadedFile.originalFilename}`;
                const updateResult = await usersCollection.updateOne(
                    { _id: userObjectId },
                    { $set: { profileImg: profileImgPath } }
                );
                console.log('Update Result:', updateResult);
                if (updateResult.matchedCount === 0) {
                    console.log("No documents matched the query");
                    return res.status(404).json({
                        status: "Fail",
                        message: "User not found",
                    });
                } else if (updateResult.modifiedCount === 0) {
                    console.log("Document matched but not modified");
                    res.status(200).json({
                        result: 'OK',
                        message: "Profile image is already up to date"
                    });
                } else {
                    // Update static file
                    const allUsers = await usersCollection.find({}).toArray();
                    await updateStaticFile(allUsers, 'users');
                    // Send success response
                    res.status(200).json({
                        result: 'OK',
                        data: { 'filename': uploadedFile.originalFilename, 'size': uploadedFile.size, 'url': profileImgPath },
                        message: "Upload and profile image update successful"
                    });
                }
            } catch (error) {
                console.log("Error updating profile image:", error);
                res.status(500).json({
                    status: "Fail",
                    message: "Failed to update profile image",
                    error: error.message,
                });
            }
        });
    });

};
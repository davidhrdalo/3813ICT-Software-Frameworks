const assert = require('assert');
const app = require('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');

const should = chai.should();
chai.use(chaiHttp);

describe('Chat API Tests', function () {
    let testUser;
    let testGroup;
    let testChannel;

    before(async function () {
        console.log("Running Chat API tests...");
        // Create test user, group, and channel before running tests
        testUser = await createTestUser();
        testGroup = await createTestGroup(testUser._id);
        testChannel = await createTestChannel(testGroup._id);
    });

    after(async function () {
        console.log("Completed Chat API tests.");
        // Clean up: delete test user, group, and channel
        await deleteTestChannel(testChannel._id);
        await deleteTestGroup(testGroup._id);
        await deleteTestUser(testUser._id);
    });

    // Helper functions
    const createTestUser = async () => {
        const res = await chai.request(app)
            .post('/api/auth/signup')
            .send({
                firstName: 'Test',
                lastName: 'User',
                username: `testuser${Date.now()}`,
                email: `testuser${Date.now()}@example.com`,
                password: 'password123',
                dob: '1990-01-01'
            });
        return res.body;
    };

    const createTestGroup = async (adminId) => {
        const res = await chai.request(app)
            .post('/api/groups')
            .send({
                name: `TestGroup${Date.now()}`,
                admins: [adminId],
                members: [adminId],
                interested: [],
                description: 'This is a test group',
                groupImg: 'http://example.com/group.jpg'
            });
        return res.body;
    };

    const createTestChannel = async (groupId) => {
        const res = await chai.request(app)
            .post('/api/channels')
            .send({
                name: `TestChannel${Date.now()}`,
                description: 'This is a test channel',
                groupId: groupId
            });
        return res.body;
    };

    const deleteTestUser = async (userId) => {
        await chai.request(app).delete(`/api/users/${userId}`);
    };

    const deleteTestGroup = async (groupId) => {
        await chai.request(app).delete(`/api/groups/${groupId}`);
    };

    const deleteTestChannel = async (channelId) => {
        await chai.request(app).delete(`/api/channels/${channelId}`);
    };

    // Test for getting chat messages for a specific channel
    describe('/GET api/chat/:channelId', () => {
        it('it should GET all chat messages for a given channel', async () => {
            const res = await chai.request(app).get(`/api/chat/${testChannel._id}`);
            res.should.have.status(200);
            res.body.should.be.a('array');
        });
    });

    // Test for posting a new chat message
    describe('/POST api/chat/:channelId', () => {
        it('it should POST a new chat message', async () => {
            const messageData = {
                userId: testUser._id,
                username: testUser.username,
                message: 'Hello, this is a test message',
                profilePic: 'http://example.com/profile.jpg',
                imageUrl: 'http://example.com/image.jpg'
            };

            const res = await chai.request(app)
                .post(`/api/chat/${testChannel._id}`)
                .send(messageData);

            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('username').eql(testUser.username);
            res.body.should.have.property('message').eql('Hello, this is a test message');
            res.body.should.have.property('channelId').eql(testChannel._id);
        });
    });

    // Test for uploading an image to the chat
    describe('/POST api/chat/:channelId/upload', () => {
        it('it should UPLOAD an image and create a chat message', async () => {
            const testImagePath = path.join(__dirname, 'testImg.jpg');

            // Ensure the test image exists
            if (!fs.existsSync(testImagePath)) {
                throw new Error('Test image not found. Please ensure testImg.jpg is in the tests directory.');
            }

            const res = await chai.request(app)
                .post(`/api/chat/${testChannel._id}/upload`)
                .attach('file', testImagePath);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            res.body.data.should.have.property('url');
        });
    });
});
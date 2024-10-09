const assert = require('assert');
const app = require('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
chai.use(chaiHttp);

describe('Channel API Tests', function () {
    let testUser;
    let testGroup;
    let testChannel;

    before(async function () {
        console.log("Running Channel API tests...");
        // Create a test user, group, and channel before running tests
        testUser = await createTestUser();
        testGroup = await createTestGroup(testUser._id);
        testChannel = await createTestChannel(testGroup._id);
    });

    after(async function () {
        console.log("Completed Channel API tests.");
        // Clean up: delete test user, group, and channel
        await deleteTestUser(testUser._id);
        await deleteTestGroup(testGroup._id);
        // We don't need to delete the channel here as it's already deleted in the test
    });

    // Helper function to create a test user
    const createTestUser = async () => {
        const res = await chai.request(app)
            .post('/api/users/create')
            .send({
                username: `testUser${Date.now()}`,
                email: `testuser${Date.now()}@example.com`,
                password: 'password123'
            });
        return res.body;
    };

    // Helper function to create a test group
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

    // Helper function to create a test channel
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

    // Helper function to delete a test user
    const deleteTestUser = async (userId) => {
        await chai.request(app).delete(`/api/users/${userId}`);
    };

    // Helper function to delete a test group
    const deleteTestGroup = async (groupId) => {
        await chai.request(app).delete(`/api/groups/${groupId}`);
    };

    // Test for getting all channels
    describe('/GET api/channels', () => {
        it('it should GET all channels', async () => {
            const res = await chai.request(app).get('/api/channels');
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.have.length.of.at.least(1);
        });
    });

    // Test for creating a new channel
    describe('/POST api/channels', () => {
        it('it should create a new channel successfully', async () => {
            const res = await chai.request(app)
                .post('/api/channels')
                .send({
                    name: 'New Test Channel',
                    description: 'This is another test channel',
                    groupId: testGroup._id
                });

            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('New Test Channel');
            res.body.should.have.property('description').eql('This is another test channel');
        });
    });

    // Test for updating a channel
    describe('/PUT api/channels/:id', () => {
        it('it should UPDATE a channel given the id', async () => {
            const updatedData = {
                name: 'Updated Channel Name',
                description: 'Updated Description'
            };

            const res = await chai.request(app)
                .put(`/api/channels/${testChannel._id}`)
                .send(updatedData);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('Updated Channel Name');
            res.body.should.have.property('description').eql('Updated Description');
        });
    });

    // Test for adding a user to a channel
    describe('/POST api/channels/:id/addMember', () => {
        it('it should ADD a user to the channel', async () => {
            const res = await chai.request(app)
                .post(`/api/channels/${testChannel._id}/addMember`)
                .send({ userId: testUser._id });

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.members.should.include(testUser._id.toString());
        });
    });

    // Test for deleting a channel
    describe('/DELETE api/channels/:id', () => {
        it('it should DELETE a channel given the id', async () => {
            const res = await chai.request(app).delete(`/api/channels/${testChannel._id}`);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Channel deleted successfully');

            // Verify the channel is deleted
            const checkRes = await chai.request(app).get(`/api/channels/${testChannel._id}`);
            checkRes.should.have.status(404);
        });
    });
});
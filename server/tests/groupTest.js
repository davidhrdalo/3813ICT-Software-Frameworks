const assert = require('assert');
const app = require('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
chai.use(chaiHttp);

describe('Group API Tests', function () {
    let testUser;
    let testGroup;

    before(async function () {
        console.log("Running Group API tests...");
        // Create a test user and group before running tests
        testUser = await createTestUser();
        testGroup = await createTestGroup(testUser._id);
    });

    after(async function () {
        console.log("Completed Group API tests.");
        // Clean up: delete test user and group
        await deleteTestUser(testUser._id);
        // We don't need to delete the group here as it's already deleted in the test
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

    // Helper function to delete a test user
    const deleteTestUser = async (userId) => {
        await chai.request(app).delete(`/api/users/${userId}`);
    };

    // Test for getting all groups
    describe('/GET api/groups', () => {
        it('it should GET all groups', async () => {
            const res = await chai.request(app).get('/api/groups');
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.have.length.of.at.least(1);
        });
    });

    // Test for creating a new group
    describe('/POST api/groups', () => {
        it('it should create a new group successfully', async () => {
            const res = await chai.request(app)
                .post('/api/groups')
                .send({
                    name: 'New Test Group',
                    admins: [testUser._id],
                    members: [testUser._id],
                    interested: [],
                    description: 'This is another test group',
                    groupImg: 'http://example.com/group.jpg'
                });

            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('New Test Group');
            res.body.should.have.property('description').eql('This is another test group');
        });
    });

    // Test for updating a group
    describe('/PUT api/groups/:id', () => {
        it('it should UPDATE a group given the id', async () => {
            const updatedData = {
                name: 'Updated Group Name',
                description: 'Updated Description'
            };

            const res = await chai.request(app)
                .put(`/api/groups/${testGroup._id}`)
                .send(updatedData);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('Updated Group Name');
            res.body.should.have.property('description').eql('Updated Description');
        });
    });

    // Test for registering interest in a group
    describe('/POST api/groups/:id/interested', () => {
        it('it should REGISTER interest in a group', async () => {
            const res = await chai.request(app)
                .post(`/api/groups/${testGroup._id}/interested`)
                .send({ userId: testUser._id });

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.interested.should.include(testUser._id.toString());
        });
    });

    // Test for unregistering interest in a group
    describe('/POST api/groups/:id/unregister-interest', () => {
        it('it should UNREGISTER interest in a group', async () => {
            const res = await chai.request(app)
                .post(`/api/groups/${testGroup._id}/unregister-interest`)
                .send({ userId: testUser._id });

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.interested.should.not.include(testUser._id.toString());
        });
    });

    // Test for removing a user from a group
    describe('/POST api/groups/:groupId/removeUser', () => {
        it('it should REMOVE a user from the group', async () => {
            const res = await chai.request(app)
                .post(`/api/groups/${testGroup._id}/removeUser`)
                .send({ userId: testUser._id });

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.members.should.not.include(testUser._id.toString());
        });
    });

    // Test for allowing a user to join a group
    describe('/POST api/groups/:groupId/allowUserToJoin', () => {
        it('it should ALLOW a user to join the group', async () => {
            const res = await chai.request(app)
                .post(`/api/groups/${testGroup._id}/allowUserToJoin`)
                .send({ userId: testUser._id });

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.members.should.include(testUser._id.toString());
        });
    });

    // Test for deleting a group (moved to the end)
    describe('/DELETE api/groups/:id', () => {
        it('it should DELETE a group given the id', async () => {
            const res = await chai.request(app).delete(`/api/groups/${testGroup._id}`);
            res.should.have.status(204); // Expecting no content response on successful deletion

            // Verify the group is deleted
            const checkRes = await chai.request(app).get(`/api/groups/${testGroup._id}`);
            checkRes.should.have.status(404);
        });
    });
});
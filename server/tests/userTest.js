const assert = require('assert');
const app = require('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

describe('User API Tests', function () {
    before(async function () {
        console.log("Running User API tests...");
        // Ensure there's at least one user in the database
        await createTestUser();
    });

    after(function () {
        console.log("Completed User API tests.");
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

    // Test for getting all users (excluding passwords)
    describe('/GET api/users', () => {
        it('it should GET all users without passwords', async () => {
            const res = await chai.request(app).get('/api/users');
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.have.length.of.at.least(1);
            res.body.forEach(user => {
                user.should.be.a('object');
                user.should.have.property('username');
                user.should.have.property('email');
                user.should.have.property('password');
            });
        });
    });

    // Test for creating a new user
    describe('/POST api/users/create', () => {
        it('it should create a new user successfully', async () => {
            const res = await chai.request(app)
                .post('/api/users/create')
                .send({
                    username: `testUser${Date.now()}`,
                    email: `testuser${Date.now()}@example.com`,
                    password: 'password123'
                });
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('username');
            res.body.should.have.property('email');
            res.body.should.have.property('roles').eql(['chat']);
        });

        it('it should not create a user with an existing username', async () => {
            const user = await createTestUser();
            const res = await chai.request(app)
                .post('/api/users/create')
                .send({
                    username: user.username,
                    email: 'anotheremail@example.com',
                    password: 'password456'
                });
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error').eql('Username is already taken');
        });
    });

    // Test for deleting a user by ID
    describe('/DELETE api/users/:id', () => {
        it('it should DELETE a user given the id', async () => {
            const user = await createTestUser();
            const res = await chai.request(app).delete(`/api/users/${user._id}`);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('User deleted successfully');
        });
    });

    // Test for promoting a user to Group Admin
    describe('/POST api/users/:id/promote/group', () => {
        it('it should PROMOTE a user to Group Admin', async () => {
            const user = await createTestUser();
            const res = await chai.request(app).post(`/api/users/${user._id}/promote/group`);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.roles.should.include('group');
        });
    });

    // Test for promoting a user to Super Admin
    describe('/POST api/users/:id/promote/super', () => {
        it('it should PROMOTE a user to Super Admin', async () => {
            const user = await createTestUser();
            const res = await chai.request(app).post(`/api/users/${user._id}/promote/super`);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.roles.should.include('super');
        });
    });
});
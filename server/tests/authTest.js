const assert = require('assert');
const app = require('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
chai.use(chaiHttp);

describe('User API Tests', function () {
    let testUser;

    before(function () {
        console.log("Running User API tests...");
    });

    after(async function () {
        console.log("Completed User API tests.");
        // Clean up: delete test user
        if (testUser && testUser._id) {
            await deleteTestUser(testUser._id);
        }
    });

    // Helper function to delete a test user
    const deleteTestUser = async (userId) => {
        try {
            await chai.request(app).delete(`/api/users/${userId}`);
        } catch (error) {
            console.error(`Error deleting test user: ${error.message}`);
        }
    };

    // Test for signup route
    describe('/POST api/auth/signup', () => {
        it('it should create a new user successfully', async () => {
            const res = await chai.request(app)
                .post('/api/auth/signup')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    username: `testuser${Date.now()}`,
                    email: `testuser${Date.now()}@example.com`,
                    password: 'password123',
                    dob: '1990-01-01'
                });

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('username');
            res.body.should.have.property('email');
            res.body.should.have.property('roles').eql(['chat']);

            testUser = res.body; // Save the created user for later use and cleanup
        });

        it('it should not create a user with an existing username', async () => {
            const res = await chai.request(app)
                .post('/api/auth/signup')
                .send({
                    firstName: 'Jane',
                    lastName: 'Doe',
                    username: testUser.username, // Use the username from the previous test
                    email: 'janedoe@example.com',
                    password: 'password456',
                    dob: '1992-05-15'
                });

            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error').eql('Username is already taken');
        });
    });

    // Test for login route
    describe('/POST api/auth', () => {
        it('it should log in the newly created user successfully', async () => {
            const res = await chai.request(app)
                .post('/api/auth')
                .send({
                    username: testUser.username,
                    password: 'password123'
                });

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('username').eql(testUser.username);
            res.body.should.have.property('email').eql(testUser.email);
            res.body.should.have.property('roles').that.includes('chat');
        });

        it('it should return an error for invalid credentials', async () => {
            const res = await chai.request(app)
                .post('/api/auth')
                .send({
                    username: testUser.username,
                    password: 'wrongpassword'
                });

            res.should.have.status(401);
            res.body.should.have.property('valid').eql(false);
            res.body.should.have.property('message').eql('Invalid credentials');
        });
    });
});
var assert = require('assert');
var app = require('../server.js');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

describe('User API Tests', function() {

    before(function() {
        console.log("Running User API tests...");
    });

    after(function() {
        console.log("Completed User API tests.");
    });

    // Test for getting all users (excluding passwords)
    describe('/GET api/users', () => {
        it('it should GET all users without passwords', (done) => {
            chai.request(app)
                .get('/api/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.forEach(user => {
                        user.should.not.have.property('password');
                    });
                    done();
                });
        });
    });

    // Test for creating a new user
    describe('/POST api/users/create', () => {
        it('it should create a new user successfully', (done) => {
            chai.request(app)
                .post('/api/users/create')
                .send({
                    username: 'testUser',
                    email: 'testuser@example.com',
                    password: 'password123'
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').eql('testUser');
                    res.body.should.have.property('email').eql('testuser@example.com');
                    res.body.should.have.property('roles').eql(['chat']);
                    done();
                });
        });

        it('it should not create a user with an existing username', (done) => {
            chai.request(app)
                .post('/api/users/create')
                .send({
                    username: 'testUser', // Same username as previous test
                    email: 'anotheremail@example.com',
                    password: 'password456'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql('Username is already taken');
                    done();
                });
        });
    });

    // Test for deleting a user by ID
    describe('/DELETE api/users/:id', () => {
        it('it should DELETE a user given the id', (done) => {
            const userId = '615c1bdee7a1f123a4a85c34'; // Replace with a valid user ID

            chai.request(app)
                .delete(`/api/users/${userId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User deleted successfully');
                    done();
                });
        });
    });

    // Test for promoting a user to Group Admin
    describe('/POST api/users/:id/promote/group', () => {
        it('it should PROMOTE a user to Group Admin', (done) => {
            const userId = '615c1bdee7a1f123a4a85c34'; // Replace with a valid user ID

            chai.request(app)
                .post(`/api/users/${userId}/promote/group`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.roles.should.include('group');
                    done();
                });
        });
    });

    // Test for promoting a user to Super Admin
    describe('/POST api/users/:id/promote/super', () => {
        it('it should PROMOTE a user to Super Admin', (done) => {
            const userId = '615c1bdee7a1f123a4a85c34'; // Replace with a valid user ID

            chai.request(app)
                .post(`/api/users/${userId}/promote/super`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.roles.should.include('super');
                    done();
                });
        });
    });

    // Test for uploading a profile image
    describe('/POST api/users/:id/upload', () => {
        it('it should UPLOAD a profile image and update the user', (done) => {
            const userId = '615c1bdee7a1f123a4a85c34'; // Replace with a valid user ID

            chai.request(app)
                .post(`/api/users/${userId}/upload`)
                .attach('image', 'path/to/test/profileImage.jpg') // Replace with actual path to a test image file
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('url');
                    done();
                });
        });
    });
});

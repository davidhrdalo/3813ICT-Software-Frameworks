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

    // Test for signup route
    describe('/POST api/auth/signup', () => {
        it('it should create a new user successfully', (done) => {
            chai.request(app)
                .post('/api/auth/signup')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    username: 'johndoe', // Ensure username does not already exist!
                    email: 'johndoe@example.com',
                    password: 'password123',
                    dob: '1990-01-01'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').eql('johndoe'); // Same here!!
                    res.body.should.have.property('email').eql('johndoe@example.com');
                    res.body.should.have.property('roles').eql(['chat']);
                    done();
                });
        });

        it('it should not create a user with an existing username', (done) => {
            chai.request(app)
                .post('/api/auth/signup')
                .send({
                    firstName: 'Jane',
                    lastName: 'Doe',
                    username: 'johndoe', // Same username as the previous test
                    email: 'janedoe@example.com',
                    password: 'password456',
                    dob: '1992-05-15'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql('Username is already taken');
                    done();
                });
        });
    });

    // Test for login route
    describe('/POST api/auth', () => {
        it('it should log in an existing user successfully', (done) => {
            chai.request(app)
                .post('/api/auth')
                .send({
                    username: 'johndoe',
                    password: 'password123'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').eql('johndoe');
                    res.body.should.have.property('email').eql('johndoe@example.com');
                    res.body.should.have.property('roles').eql(['chat']);
                    done();
                });
        });

        it('it should return an error for invalid credentials', (done) => {
            chai.request(app)
                .post('/api/auth')
                .send({
                    username: 'johndoe',
                    password: 'wrongpassword'
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('valid').eql(false);
                    res.body.should.have.property('message').eql('Invalid credentials');
                    done();
                });
        });
    });
});

var assert = require('assert');
var app = require('../server.js');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

describe('Chat API Tests', function() {

    before(function() {
        console.log("Running Chat API tests...");
    });

    after(function() {
        console.log("Completed Chat API tests.");
    });

    // Test for getting chat messages for a specific channel
    describe('/GET api/chat/:channelId', () => {
        it('it should GET all chat messages for a given channel', (done) => {
            // Replace this with a valid channel ID from your database
            const channelId = '78909ba4f40c4b8f9d5f9f9e'; 

            chai.request(app)
                .get(`/api/chat/${channelId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    // Test for posting a new chat message
    describe('/POST api/chat/:channelId', () => {
        it('it should POST a new chat message', (done) => {
            const messageData = {
                userId: '64e09ba1f40c4b8f9d5f9f9b', // Using existing user ID (john_doe)
                username: 'john_doe',
                message: 'Hello, this is a test message',
                profilePic: 'http://localhost:3000/data/images/profileImages/37.jpg', // Using existing profile image
                imageUrl: 'http://example.com/image.jpg'
            };

            // Replace this with a valid channel ID from your database
            const channelId = '78909ba4f40c4b8f9d5f9f9e'; 

            chai.request(app)
                .post(`/api/chat/${channelId}`)
                .send(messageData)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').eql('john_doe');
                    res.body.should.have.property('message').eql('Hello, this is a test message');
                    res.body.should.have.property('channelId').eql(channelId);
                    done();
                });
        });
    });

    // Test for uploading an image to the chat
    describe('/POST api/chat/:channelId/upload', () => {
        it('it should UPLOAD an image and create a chat message', (done) => {
            // Replace this with a valid channel ID from your database
            const channelId = '78909ba4f40c4b8f9d5f9f9e';

            chai.request(app)
                .post(`/api/chat/${channelId}/upload`)
                .attach('file', 'path/to/test/image.jpg')  // Replace with actual path to a test image file
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

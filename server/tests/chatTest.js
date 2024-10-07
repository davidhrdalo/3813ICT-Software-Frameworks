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
            const channelId = '615c1bdee7a1f123a4a85c34'; 

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
                userId: '615c1bdee7a1f123a4a85c34', // Replace with valid user ID
                username: 'testUser',
                message: 'Hello, this is a test message',
                profilePic: 'http://example.com/profilePic.jpg',
                imageUrl: 'http://example.com/image.jpg'
            };

            // Replace this with a valid channel ID from your database
            const channelId = '615c1bdee7a1f123a4a85c34'; 

            chai.request(app)
                .post(`/api/chat/${channelId}`)
                .send(messageData)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').eql('testUser');
                    res.body.should.have.property('message').eql('Hello, this is a test message');
                    res.body.should.have.property('channelId');
                    done();
                });
        });
    });

    // Test for uploading an image to the chat
    describe('/POST api/chat/:channelId/upload', () => {
        it('it should UPLOAD an image and create a chat message', (done) => {
            // Replace this with a valid channel ID from your database
            const channelId = '615c1bdee7a1f123a4a85c34';

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

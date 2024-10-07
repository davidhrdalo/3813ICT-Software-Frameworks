var assert = require('assert');
var app = require('../server.js');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

describe('Channel API Tests', function() {

    before(function() {
        console.log("Running Channel API tests...");
    });

    after(function() {
        console.log("Completed Channel API tests.");
    });

    // Test for getting all channels
    describe('/GET api/channels', () => {
        it('it should GET all channels', (done) => {
            chai.request(app)
                .get('/api/channels')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    // Test for creating a new channel
    describe('/POST api/channels', () => {
        it('it should create a new channel successfully', (done) => {
            chai.request(app)
                .post('/api/channels')
                .send({
                    name: 'New Channel',
                    description: 'This is a test channel',
                    groupId: '615c1bdee7a1f123a4a85c34' // Ensure this groupId exists
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql('New Channel');
                    res.body.should.have.property('description').eql('This is a test channel');
                    done();
                });
        });
    });

    // Test for updating a channel
    describe('/PUT api/channels/:id', () => {
        it('it should UPDATE a channel given the id', (done) => {
            const updatedData = {
                name: 'Updated Channel Name',
                description: 'Updated Description'
            };

            // Replace this with a valid channel ID from your database
            const channelId = '615c1bdee7a1f123a4a85c34'; 

            chai.request(app)
                .put(`/api/channels/${channelId}`)
                .send(updatedData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql('Updated Channel Name');
                    res.body.should.have.property('description').eql('Updated Description');
                    done();
                });
        });
    });

    // Test for deleting a channel
    describe('/DELETE api/channels/:id', () => {
        it('it should DELETE a channel given the id', (done) => {
            // Replace this with a valid channel ID from your database
            const channelId = '615c1bdee7a1f123a4a85c34'; 

            chai.request(app)
                .delete(`/api/channels/${channelId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Channel deleted successfully');
                    done();
                });
        });
    });

    // Test for adding a user to a channel
    describe('/POST api/channels/:id/addMember', () => {
        it('it should ADD a user to the channel', (done) => {
            const userId = '615c1bdee7a1f123a4a85c34'; // Replace with valid user ID

            // Replace with valid channel ID
            const channelId = '615c1bdee7a1f123a4a85c34'; 

            chai.request(app)
                .post(`/api/channels/${channelId}/addMember`)
                .send({ userId })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.members.should.include(userId);
                    done();
                });
        });
    });

    // Test for removing a user from a channel
    describe('/POST api/channels/:id/removeMember', () => {
        it('it should REMOVE a user from the channel', (done) => {
            const userId = '615c1bdee7a1f123a4a85c34'; // Replace with valid user ID

            // Replace with valid channel ID
            const channelId = '615c1bdee7a1f123a4a85c34'; 

            chai.request(app)
                .post(`/api/channels/${channelId}/removeMember`)
                .send({ userId })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.members.should.not.include(userId);
                    done();
                });
        });
    });

});

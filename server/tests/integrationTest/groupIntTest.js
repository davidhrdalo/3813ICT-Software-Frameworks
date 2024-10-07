var assert = require('assert');
var app = require('../../server.js');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

describe('Group API Tests', function() {

    before(function() {
        console.log("Running Group API tests...");
    });

    after(function() {
        console.log("Completed Group API tests.");
    });

    // Test for getting all groups
    describe('/GET api/groups', () => {
        it('it should GET all groups', (done) => {
            chai.request(app)
                .get('/api/groups')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    // Test for creating a new group
    describe('/POST api/groups', () => {
        it('it should create a new group successfully', (done) => {
            chai.request(app)
                .post('/api/groups')
                .send({
                    name: 'New Group',
                    admins: ['615c1bdee7a1f123a4a85c34'], // Replace with valid admin IDs
                    members: ['615c1bdee7a1f123a4a85c34'],
                    interested: [],
                    description: 'This is a test group',
                    groupImg: 'http://example.com/image.jpg'
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql('New Group');
                    res.body.should.have.property('description').eql('This is a test group');
                    done();
                });
        });
    });

    // Test for updating a group
    describe('/PUT api/groups/:id', () => {
        it('it should UPDATE a group given the id', (done) => {
            const updatedData = {
                name: 'Updated Group Name',
                description: 'Updated Description'
            };

            // Replace this with a valid group ID from your database
            const groupId = '615c1bdee7a1f123a4a85c34'; 

            chai.request(app)
                .put(`/api/groups/${groupId}`)
                .send(updatedData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql('Updated Group Name');
                    res.body.should.have.property('description').eql('Updated Description');
                    done();
                });
        });
    });

    // Test for deleting a group
    describe('/DELETE api/groups/:id', () => {
        it('it should DELETE a group given the id', (done) => {
            // Replace this with a valid group ID from your database
            const groupId = '615c1bdee7a1f123a4a85c34'; 

            chai.request(app)
                .delete(`/api/groups/${groupId}`)
                .end((err, res) => {
                    res.should.have.status(204); // Expecting no content response on successful deletion
                    done();
                });
        });
    });

    // Test for registering interest in a group
    describe('/POST api/groups/:id/interested', () => {
        it('it should REGISTER interest in a group', (done) => {
            const userId = '615c1bdee7a1f123a4a85c34'; // Replace with valid user ID

            // Replace with valid group ID
            const groupId = '615c1bdee7a1f123a4a85c34'; 

            chai.request(app)
                .post(`/api/groups/${groupId}/interested`)
                .send({ userId })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.interested.should.include(userId);
                    done();
                });
        });
    });

    // Test for unregistering interest in a group
    describe('/POST api/groups/:id/unregister-interest', () => {
        it('it should UNREGISTER interest in a group', (done) => {
            const userId = '615c1bdee7a1f123a4a85c34'; // Replace with valid user ID

            // Replace with valid group ID
            const groupId = '615c1bdee7a1f123a4a85c34'; 

            chai.request(app)
                .post(`/api/groups/${groupId}/unregister-interest`)
                .send({ userId })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.interested.should.not.include(userId);
                    done();
                });
        });
    });

    // Test for removing a user from a group
    describe('/POST api/groups/:groupId/removeUser', () => {
        it('it should REMOVE a user from the group', (done) => {
            const userId = '615c1bdee7a1f123a4a85c34'; // Replace with valid user ID

            // Replace with valid group ID
            const groupId = '615c1bdee7a1f123a4a85c34'; 

            chai.request(app)
                .post(`/api/groups/${groupId}/removeUser`)
                .send({ userId })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.members.should.not.include(userId);
                    done();
                });
        });
    });

    // Test for allowing a user to join a group
    describe('/POST api/groups/:groupId/allowUserToJoin', () => {
        it('it should ALLOW a user to join the group', (done) => {
            const userId = '615c1bdee7a1f123a4a85c34'; // Replace with valid user ID

            // Replace with valid group ID
            const groupId = '615c1bdee7a1f123a4a85c34'; 

            chai.request(app)
                .post(`/api/groups/${groupId}/allowUserToJoin`)
                .send({ userId })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.members.should.include(userId);
                    done();
                });
        });
    });
});

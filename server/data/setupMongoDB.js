const { MongoClient, ObjectId } = require('mongodb');
const { updateStaticFile } = require('./staticDataHandler.js');

const uri = 'mongodb://localhost:27017';
const dbName = 'softwareFrameworks';

const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db(dbName);

    // Create collections
    const usersCollection = db.collection('users');
    const groupsCollection = db.collection('groups');
    const channelsCollection = db.collection('channels');

    // Prepare data with ObjectIds
    const users = [
      {
        _id: new ObjectId("64e09ba0f40c4b8f9d5f9f9a"),
        username: "super_admin",
        email: "superadmin@example.com",
        password: "123",
        roles: ["super", "group", "chat"],
        profileImg: "http://localhost:3000/data/images/profileImages/defaultProfile.jpg",
        firstName: "Super",
        lastName: "Admin",
        dob: "1980-01-01",
        status: "Active"
      },
      {
        _id: new ObjectId("64e09ba1f40c4b8f9d5f9f9b"),
        username: "john_doe",
        email: "john.doe@example.com",
        password: "pw",
        roles: ["super", "group", "chat"],
        profileImg: "http://localhost:3000/data/images/profileImages/37.jpg",
        firstName: "John",
        lastName: "Doe",
        dob: "1990-08-17",
        status: "Busy"
      },
      {
        _id: new ObjectId("64e09ba2f40c4b8f9d5f9f9c"),
        username: "jane_smith",
        email: "jane.smith@example.com",
        password: "pw",
        roles: ["chat"],
        profileImg: "http://localhost:3000/data/images/profileImages/58.jpg",
        firstName: "Jane",
        lastName: "Smith",
        dob: "1992-03-26",
        status: "Available"
      },
      {
        _id: new ObjectId("64e09ba3f40c4b8f9d5f9f9d"),
        username: "alice_jones",
        email: "alice.jones@example.com",
        password: "pw",
        roles: ["chat"],
        profileImg: "http://localhost:3000/data/images/profileImages/430.jpg",
        firstName: "Alice",
        lastName: "Jones",
        dob: "1998-06-10",
        status: "Away"
      },
      {
        _id: new ObjectId("64e09ba4f40c4b8f9d5f9f9e"),
        username: "robert_brown",
        email: "robert.brown@example.com",
        password: "pw",
        roles: ["group", "chat"],
        profileImg: "http://localhost:3000/data/images/profileImages/550.jpg",
        firstName: "Robert",
        lastName: "Brown",
        dob: "1985-11-20",
        status: "Active"
      }
    ];

    const userIdMap = users.reduce((map, user) => {
      map[user.username] = user._id;
      return map;
    }, {});

    const groups = [
      {
        _id: new ObjectId("64e09ba4f40c4b8f9d5f9f9e"),
        name: "Developers",
        admins: [userIdMap.super_admin],
        members: [userIdMap.super_admin, userIdMap.john_doe, userIdMap.jane_smith],
        interested: [],
        description: "Group for software developers",
        groupImg: "http://localhost:3000/data/images/groupImages/473.jpg"
      },
      {
        _id: new ObjectId("64e09ba4f40c4b8f9d5f9f9f"),
        name: "Project Management",
        admins: [userIdMap.robert_brown],
        members: [userIdMap.robert_brown, userIdMap.super_admin],
        interested: [],
        description: "Group for project management discussions",
        groupImg: "http://localhost:3000/data/images/groupImages/430.jpg"
      },
      {
        _id: new ObjectId("64e09ba4f40c4b8f9d5f9f9d"),
        name: "Designers",
        admins: [userIdMap.john_doe],
        members: [userIdMap.john_doe, userIdMap.jane_smith, userIdMap.alice_jones],
        interested: [],
        description: "Group for creative design",
        groupImg: "http://localhost:3000/data/images/groupImages/58.jpg"
      },
      {
        _id: new ObjectId("64e09ba4f40c4b8f9d5f9f9c"),
        name: "Testers",
        admins: [userIdMap.jane_smith],
        members: [userIdMap.jane_smith, userIdMap.robert_brown],
        interested: [],
        description: "Group for testing and quality assurance",
        groupImg: "http://localhost:3000/data/images/groupImages/37.jpg"
      }
    ];

    const groupIdMap = groups.reduce((map, group) => {
      map[group.name] = group._id;
      return map;
    }, {});

    const channels = [
      {
        _id: new ObjectId("78909ba4f40c4b8f9d5f9f9e"),
        name: "General Discussion",
        groupId: groupIdMap["Developers"],
        description: "General chat for all members",
        members: [userIdMap.super_admin, userIdMap.john_doe, userIdMap.jane_smith]
      },
      {
        _id: new ObjectId("64ebc0f4f40c4b8f9d5f9f9f"),
        name: "Project Updates",
        groupId: groupIdMap["Project Management"],
        description: "Project management discussions",
        members: [userIdMap.robert_brown, userIdMap.super_admin]
      },
      {
        _id: new ObjectId("64e09ba4f40c4b8f9d5f9f8d"),
        name: "Design Critiques",
        groupId: groupIdMap["Designers"],
        description: "Feedback and critique sessions for design",
        members: [userIdMap.john_doe, userIdMap.jane_smith, userIdMap.alice_jones]
      },
      {
        _id: new ObjectId("64ebc0f4f40c4b8f9d5f9f9e"),
        name: "QA Testing",
        groupId: groupIdMap["Testers"],
        description: "Channel for discussing QA testing strategies",
        members: [userIdMap.jane_smith, userIdMap.robert_brown]
      }
    ];

    // Insert data into collections
    await usersCollection.insertMany(users);
    await groupsCollection.insertMany(groups);
    await channelsCollection.insertMany(channels);

    // Write data to the static JSON file
    await updateStaticFile(users, 'users');
    await updateStaticFile(groups, 'groups');
    await updateStaticFile(channels, 'channels');

    console.log('Data inserted successfully');
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

main().catch(console.error);
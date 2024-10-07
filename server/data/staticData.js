module.exports = {
  "groups": [
    {
      "_id": "66f7b6934b316144de297cc2",
      "name": "Developers",
      "admins": [
        "66f7b6934b316144de297cbd"
      ],
      "members": [
        "66f7b6934b316144de297cbd",
        "66f7b6934b316144de297cbe",
        "66f7b6934b316144de297cbf"
      ],
      "interested": [],
      "description": "Group for software developers",
      "groupImg": "http://localhost:3000/data/images/groupImages/images.jpg",
      "profileImg": "http://localhost:3000/data/images/groupImages/images.jpg"
    },
    {
      "_id": "66f7b6934b316144de297cc3",
      "name": "Project Management",
      "admins": [
        "66f7b6934b316144de297cc1"
      ],
      "members": [
        "66f7b6934b316144de297cc1",
        "66f7b6934b316144de297cbd"
      ],
      "interested": [],
      "description": "Group for project management discussions",
      "groupImg": "http://localhost:3000/data/images/groupImages/Cat03.jpg"
    },
    {
      "_id": "66f7b6934b316144de297cc4",
      "name": "Designers",
      "admins": [
        "66f7b6934b316144de297cbe"
      ],
      "members": [
        "66f7b6934b316144de297cbe",
        "66f7b6934b316144de297cbf",
        "66f7b6934b316144de297cc0"
      ],
      "interested": [],
      "description": "Group for creative design",
      "groupImg": "assets/images/58.jpg"
    },
    {
      "_id": "66f7b6934b316144de297cc5",
      "name": "Testers",
      "admins": [
        "66f7b6934b316144de297cbf"
      ],
      "members": [
        "66f7b6934b316144de297cbf",
        "66f7b6934b316144de297cc1"
      ],
      "interested": [],
      "description": "Group for testing and quality assurance",
      "groupImg": "assets/images/37.jpg"
    }
  ],
  "users": [
    {
      "_id": "66f7b6934b316144de297cbd",
      "username": "super_admin",
      "email": "superadmin@example.com",
      "password": "123",
      "roles": [
        "super",
        "group",
        "chat"
      ],
      "profileImg": "assets/images/defaultProfile.jpg",
      "firstName": "Super",
      "lastName": "Admin",
      "dob": "1980-01-01",
      "status": "Active"
    },
    {
      "_id": "66f7b6934b316144de297cbe",
      "username": "john_doe",
      "email": "john.doe@example.com",
      "password": "pw",
      "roles": [
        "super",
        "group",
        "chat"
      ],
      "profileImg": "http://localhost:3000/data/images/profileImages/images.jpg",
      "firstName": "John",
      "lastName": "Doe",
      "dob": "1990-08-17",
      "status": "Busy"
    },
    {
      "_id": "66f7b6934b316144de297cbf",
      "username": "jane_smith",
      "email": "jane.smith@example.com",
      "password": "pw",
      "roles": [
        "chat"
      ],
      "profileImg": "assets/images/58.jpg",
      "firstName": "Jane",
      "lastName": "Smith",
      "dob": "1992-03-26",
      "status": "Available"
    },
    {
      "_id": "66f7b6934b316144de297cc0",
      "username": "alice_jones",
      "email": "alice.jones@example.com",
      "password": "pw",
      "roles": [
        "chat"
      ],
      "profileImg": "assets/images/430.jpg",
      "firstName": "Alice",
      "lastName": "Jones",
      "dob": "1998-06-10",
      "status": "Away"
    },
    {
      "_id": "66f7b6934b316144de297cc1",
      "username": "robert_brown",
      "email": "robert.brown@example.com",
      "password": "pw",
      "roles": [
        "group",
        "chat"
      ],
      "profileImg": "assets/images/550.jpg",
      "firstName": "Robert",
      "lastName": "Brown",
      "dob": "1985-11-20",
      "status": "Active"
    }
  ],
  "channels": [
    {
      "_id": "66f7b6934b316144de297cc6",
      "name": "General Discussinon",
      "groupId": "66f7b6934b316144de297cc2",
      "description": "General chat for all members",
      "members": [
        "66f7b6934b316144de297cbd",
        "66f7b6934b316144de297cbe",
        "66f7b6934b316144de297cbf"
      ]
    },
    {
      "_id": "66f7b6934b316144de297cc7",
      "name": "Project Updates",
      "groupId": "66f7b6934b316144de297cc3",
      "description": "Project management discussions",
      "members": [
        "66f7b6934b316144de297cc1",
        "66f7b6934b316144de297cbd"
      ]
    },
    {
      "_id": "66f7b6934b316144de297cc8",
      "name": "Design Critiques",
      "groupId": "66f7b6934b316144de297cc4",
      "description": "Feedback and critique sessions for design",
      "members": [
        "66f7b6934b316144de297cbe",
        "66f7b6934b316144de297cbf",
        "66f7b6934b316144de297cc0"
      ]
    },
    {
      "_id": "66f7b6934b316144de297cc9",
      "name": "QA Testing",
      "groupId": "66f7b6934b316144de297cc5",
      "description": "Channel for discussing QA testing strategies",
      "members": [
        "66f7b6934b316144de297cbf",
        "66f7b6934b316144de297cc1"
      ]
    },
    {
      "_id": "670361c789e1ecabb1eac6de",
      "name": "d",
      "groupId": "66f7b6934b316144de297cc2",
      "description": "d",
      "members": []
    }
  ]
};
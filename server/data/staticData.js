module.exports = {
  "groups": [],
  "users": [
    {
      "_id": "66f7da9517c8f02911b71bd1",
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
      "_id": "66f7da9517c8f02911b71bd2",
      "username": "john_doe",
      "email": "john.doe@example.com",
      "password": "pw",
      "roles": [
        "super",
        "group",
        "chat"
      ],
      "profileImg": "assets/images/37.jpg",
      "firstName": "John",
      "lastName": "Doe",
      "dob": "1990-08-17",
      "status": "Busy"
    },
    {
      "_id": "66f7da9517c8f02911b71bd3",
      "username": "jane_smith",
      "email": "jane.smith@example.com",
      "password": "pw",
      "roles": [
        "chat",
        "group",
        "super"
      ],
      "profileImg": "assets/images/58.jpg",
      "firstName": "Jane",
      "lastName": "Smith",
      "dob": "1992-03-26",
      "status": "Available"
    },
    {
      "_id": "66f7da9517c8f02911b71bd4",
      "username": "alice_jones",
      "email": "alice.jones@example.com",
      "password": "pw",
      "roles": [
        "chat",
        "super"
      ],
      "profileImg": "assets/images/430.jpg",
      "firstName": "Alice",
      "lastName": "Jones",
      "dob": "1998-06-10",
      "status": "Away"
    },
    {
      "_id": "66f7dc4264ea7bc333458b3b",
      "username": "egwF",
      "email": "Ef",
      "password": "Eqwfg",
      "roles": [
        "chat"
      ],
      "profileImg": "assets/images/defaultProfile.jpg",
      "firstName": "",
      "lastName": "",
      "dob": "",
      "status": "Active"
    },
    {
      "_id": "66f7dd24fbcdb40f1719e7bc",
      "username": "s",
      "email": "s",
      "password": "s",
      "roles": [
        "chat"
      ],
      "profileImg": "assets/images/defaultProfile.jpg",
      "firstName": "",
      "lastName": "",
      "dob": "",
      "status": "Active"
    }
  ],
  "channels": [
    {
      "_id": "66f7da9517c8f02911b71bda",
      "name": "General Discussion",
      "groupId": "66f7da9517c8f02911b71bd6",
      "description": "General chat for all members",
      "members": [
        "66f7da9517c8f02911b71bd1",
        "66f7da9517c8f02911b71bd2",
        "66f7da9517c8f02911b71bd3"
      ]
    },
    {
      "_id": "66f7da9517c8f02911b71bdc",
      "name": "Design Critiques",
      "groupId": "66f7da9517c8f02911b71bd8",
      "description": "Feedback and critique sessions for design",
      "members": [
        "66f7da9517c8f02911b71bd2",
        "66f7da9517c8f02911b71bd3",
        "66f7da9517c8f02911b71bd4"
      ]
    },
    {
      "_id": "66f7da9517c8f02911b71bdd",
      "name": "QA Testing",
      "groupId": "66f7da9517c8f02911b71bd9",
      "description": "Channel for discussing QA testing strategies",
      "members": [
        "66f7da9517c8f02911b71bd3",
        "66f7da9517c8f02911b71bd5"
      ]
    },
    {
      "_id": "66f7dd36d4f6c79a42ca8203",
      "name": "s",
      "groupId": "66f7da9517c8f02911b71bd6",
      "description": "s",
      "members": []
    }
  ]
};
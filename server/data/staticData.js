const d = {
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "password": "pw",
      "roles": [
        "super",
        "group",
        "chat"
      ],
      "profileImg": "assets/images/37.jpg",
      "firstName": "John",
      "lastName": "Doe",
      "dob": "2001-08-17",
      "status": "Busy"
    },
    {
      "id": 2,
      "username": "jane_smith",
      "email": "jane@example.com",
      "password": "pw",
      "roles": [
        "group",
        "chat"
      ],
      "profileImg": "assets/images/58.jpg",
      "firstName": "Jane",
      "lastName": "Smith",
      "dob": "2002-03-26",
      "status": "Available"
    },
    {
      "id": 3,
      "username": "alice_jones",
      "email": "alice@example.com",
      "password": "pw",
      "roles": [
        "chat"
      ],
      "profileImg": "assets/images/430.jpg",
      "firstName": "Alice",
      "lastName": "Jones",
      "dob": "2020-06-10",
      "status": "Away"
    },
    {
      "id": 1725419062400,
      "username": "x",
      "email": "x",
      "password": "x",
      "roles": [
        "chat",
        "group"
      ],
      "profileImg": "assets/images/defaultProfile.jpg",
      "firstName": "",
      "lastName": "",
      "dob": "",
      "status": "Active"
    },
    {
      "id": 1725437726943,
      "username": "test",
      "email": "test",
      "password": "test",
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
  "groups": [
    {
      "id": 1,
      "name": "group1",
      "admins": [
        1
      ],
      "members": [
        1,
        1725437726943,
        1725438063697
      ],
      "interested": [],
      "description": "Desc1",
      "groupImg": "assets/images/473.jpg"
    },
    {
      "id": 2,
      "name": "group2",
      "admins": [
        2
      ],
      "members": [
        1,
        3,
        1725419062400
      ],
      "interested": [
        1725437726943,
        1725438063697
      ],
      "description": "Desc2",
      "groupImg": "assets/images/475.jpg"
    },
    {
      "id": 3,
      "name": "group3",
      "admins": [
        2
      ],
      "members": [
        1,
        2,
        3
      ],
      "interested": [
        1725437726943
      ],
      "description": "Desc3",
      "groupImg": "assets/images/550.jpg"
    },
    {
      "id": 4,
      "name": "Dogs!",
      "admins": [
        3
      ],
      "members": [
        6
      ],
      "interested": [
        1725437726943
      ],
      "description": "Desc3",
      "groupImg": "assets/images/550.jpg"
    },
    {
      "id": 5,
      "name": "Nope!",
      "admins": [
        5
      ],
      "members": [],
      "interested": [],
      "description": "Desc3",
      "groupImg": "assets/images/550.jpg"
    },
    {
      "id": 1725419425633,
      "name": "x",
      "admins": [
        1725419062400
      ],
      "members": [],
      "interested": [],
      "description": "x",
      "groupImg": "assets/images/defaultGroup.jpg"
    }
  ],
  "channels": [
    {
      "id": 2,
      "name": "channel2",
      "groupId": 1,
      "description": "Lets chat about dogs!",
      "members": [
        1725437726943,
        1725438063697
      ]
    },
    {
      "id": 3,
      "name": "channel3",
      "groupId": 1,
      "description": "Lets chat about lions!",
      "members": [
        1725437726943
      ]
    },
    {
      "id": 4,
      "name": "channel3",
      "groupId": 1,
      "description": "Lets chat about people!",
      "members": []
    },
    {
      "id": 5,
      "name": "channel3",
      "groupId": 1,
      "description": "Lets not chats!",
      "members": []
    },
    {
      "id": 6,
      "name": "channel3",
      "groupId": 1,
      "description": "Hi.",
      "members": [
        1725438063697
      ]
    },
    {
      "id": 1725419437492,
      "name": "xd",
      "groupId": 1725419425633,
      "description": "x",
      "members": []
    },
    {
      "id": 1725429494058,
      "name": "x",
      "groupId": 1725419425633,
      "description": "x",
      "members": []
    },
    {
      "id": 1725431559141,
      "name": "x",
      "groupId": 2,
      "description": "x",
      "members": [
        3,
        1725419062400
      ]
    }
  ]
}
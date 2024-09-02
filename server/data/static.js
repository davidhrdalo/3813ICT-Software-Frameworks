const users = [
    new User(1, 'john_doe', 'john@example.com', 'pw', 'super', 'assets/images/37.jpg', 'John', 'Doe', '2001-08-17', 'Busy'),
    new User(2, 'jane_smith', 'jane@example.com', 'pw', 'group', 'assets/images/58.jpg', 'Jane', 'Smith', '2002-03-26', 'Available'),
    new User(3, 'alice_jones', 'alice@example.com', 'pw', 'chat', 'assets/images/430.jpg', 'Alice', 'Jones', '2020-06-10', 'Away')
];

const channels = [
    new Channel(1, 'channel1', 1, 'Lets chat about cats!'),
    new Channel(2, 'channel2', 1, 'Lets chat about dogs!'),
    new Channel(3, 'channel3', 1, 'Lets chat about lions!'),
    new Channel(4, 'channel3', 1, 'Lets chat about people!'),
    new Channel(5, 'channel3', 1, 'Lets not chats!'),
    new Channel(6, 'channel3', 1, 'Hi.'),
];

const groups = [
    new Group(1, 'group1', [1], [1, 2], [], 'Desc1', 'assets/images/473.jpg'), // group with Super Admin and Group Admin
    new Group(2, 'group2', [2], [1, 3], [], 'Desc2', 'assets/images/475.jpg'),  // group with Group Admin and Chat User
    new Group(3, 'group3', [2], [1, 2, 3], [], 'Desc3', 'assets/images/550.jpg'),  // group with Group Admin and Chat User
    new Group(3, 'Dogs!', [3], [6], [], 'Desc3', 'assets/images/550.jpg'),
    new Group(3, 'Nope!', [5], [], [], 'Desc3', 'assets/images/550.jpg'),

];

const data = {
    "users": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "password": "pw",
        "roles": ["super"],
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
        "role": "group",
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
        "role": "chat",
        "profileImg": "assets/images/430.jpg",
        "firstName": "Alice",
        "lastName": "Jones",
        "dob": "2020-06-10",
        "status": "Away"
      }
    ],
    "groups": [
      {
        "id": 1,
        "name": "group1",
        "admins": [1],
        "members": [1, 2],
        "interested": [],
        "description": "Desc1",
        "groupImg": "assets/images/473.jpg"
      },
      {
        "id": 2,
        "name": "group2",
        "admins": [2],
        "members": [1, 3],
        "interested": [],
        "description": "Desc2",
        "groupImg": "assets/images/475.jpg"
      },
      {
        "id": 3,
        "name": "group3",
        "admins": [2],
        "members": [1, 2, 3],
        "interested": [],
        "description": "Desc3",
        "groupImg": "assets/images/550.jpg"
      },
      {
        "id": 4,
        "name": "Dogs!",
        "admins": [3],
        "members": [6],
        "interested": [],
        "description": "Desc3",
        "groupImg": "assets/images/550.jpg"
      },
      {
        "id": 5,
        "name": "Nope!",
        "admins": [5],
        "members": [],
        "interested": [],
        "description": "Desc3",
        "groupImg": "assets/images/550.jpg"
      }
    ],
    "channels": [
      {
        "id": 1,
        "name": "channel1",
        "groupId": 1,
        "description": "Lets chat about cats!"
      },
      {
        "id": 2,
        "name": "channel2",
        "groupId": 1,
        "description": "Lets chat about dogs!"
      },
      {
        "id": 3,
        "name": "channel3",
        "groupId": 1,
        "description": "Lets chat about lions!"
      },
      {
        "id": 4,
        "name": "channel3",
        "groupId": 1,
        "description": "Lets chat about people!"
      },
      {
        "id": 5,
        "name": "channel3",
        "groupId": 1,
        "description": "Lets not chats!"
      },
      {
        "id": 6,
        "name": "channel3",
        "groupId": 1,
        "description": "Hi."
      }
    ]
  }
  
// File to support seeding data

// User Data
class User {
    constructor(id, username, email, password, role, profileImg, firstName, lastName, dob, status) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.profileImg = profileImg;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.status = status;
    }
}

const users = [
    new User(1, 'john_doe', 'john@example.com', 'pw', 'super', 'assets/images/37.jpg', 'John', 'Doe', '2001-08-17', 'Busy'),
    new User(2, 'jane_smith', 'jane@example.com', 'pw', 'group', 'assets/images/58.jpg', 'Jane', 'Smith', '2002-03-26', 'Available'),
    new User(3, 'alice_jones', 'alice@example.com', 'pw', 'chat', 'assets/images/430.jpg', 'Alice', 'Jones', '2020-06-10', 'Away')
];

// Channel Data
class Channel {
    constructor(id, name, groupId, description) {
        this.id = id;
        this.name = name;
        this.groupId = groupId;
        this.description = description;
    }
}

const channels = [
    new Channel(1, 'channel1', 1, 'Lets chat about cats!'),
    new Channel(2, 'channel2', 1, 'Lets chat about dogs!'),
    new Channel(3, 'channel3', 1, 'Lets chat about lions!'),
    new Channel(4, 'channel3', 1, 'Lets chat about people!'),
    new Channel(5, 'channel3', 1, 'Lets not chats!'),
    new Channel(6, 'channel3', 1, 'Hi.'),
];

// Group Data
class Group {
    constructor(id, name, admins = [], members = [], description, groupImg) {
        this.id = id;
        this.name = name;
        this.admins = admins;
        this.members = members;
        this.description = description;
        this.groupImg = groupImg;
    }
}

const groups = [
    new Group(1, 'group1', [1], [1, 2], 'Desc1', 'assets/images/473.jpg'), // group with Super Admin and Group Admin
    new Group(2, 'group2', [2], [1, 3], 'Desc2', 'assets/images/475.jpg'),  // group with Group Admin and Chat User
    new Group(3, 'group3', [2], [1, 2, 3], 'Desc3', 'assets/images/550.jpg'),  // group with Group Admin and Chat User
    new Group(3, 'Dogs!', [3], [6], 'Desc3', 'assets/images/550.jpg'),
    new Group(3, 'Nope!', [5], [], 'Desc3', 'assets/images/550.jpg'),

];

// Final Export back into routes
module.exports = {User, users, Channel, channels, Group, groups};
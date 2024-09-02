const fs = require('fs');
const path = require('path');

// File to support seeding data

// User Data
class User {
    constructor(id, username, email, password, roles, profileImg, firstName, lastName, dob, status) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.profileImg = profileImg;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.status = status;
    }
}

// Group Data
class Group {
    constructor(id, name, admins = [], members = [], interested = [], description, groupImg) {
        this.id = id;
        this.name = name;
        this.admins = admins;
        this.members = members;
        this.interested = interested;
        this.description = description;
        this.groupImg = groupImg;
    }
}

// Channel Data
class Channel {
    constructor(id, name, groupId, description) {
        this.id = id;
        this.name = name;
        this.groupId = groupId;
        this.description = description;
    }
}

const dataFilePath = path.join(__dirname, 'data.json');

function loadData() {
    if (fs.existsSync(dataFilePath)) {
        const rawData = fs.readFileSync(dataFilePath);
        const data = JSON.parse(rawData);
        return {
            users: data.users.map(u => new User(u.id, u.username, u.email, u.password, u.roles, u.profileImg, u.firstName, u.lastName, u.dob, u.status)),
            groups: data.groups.map(g => new Group(g.id, g.name, g.admins, g.members, g.interested, g.description, g.groupImg)),
            channels: data.channels.map(c => new Channel(c.id, c.name, c.groupId, c.description)),
        };
    } else {
        return { users: [], groups: [], channels: [] };
    }
}

function saveData(updatedData) {
    let currentData = { users: [], groups: [], channels: [] };

    if (fs.existsSync(dataFilePath)) {
        const rawData = fs.readFileSync(dataFilePath);
        currentData = JSON.parse(rawData);
    }

    const dataToSave = {
        users: updatedData.users || currentData.users,
        groups: updatedData.groups || currentData.groups,
        channels: updatedData.channels || currentData.channels
    };

    fs.writeFileSync(dataFilePath, JSON.stringify(dataToSave, null, 2));
}


const { users, groups, channels } = loadData();

// Export classes and data
module.exports = { User, users, Channel, channels, Group, groups, saveData };

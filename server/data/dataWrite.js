const fs = require('fs'); // 'fs' module is used for interacting with the file system, allowing reading and writing files.
const path = require('path'); // 'path' module provides utilities for working with file and directory paths.

// File to support seeding data

// User class to represent user data structure
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

// Group class to represent group data structure
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

// Channel class to represent channel data structure
class Channel {
    constructor(id, name, groupId, description, members = []) {
        this.id = id;
        this.name = name;
        this.groupId = groupId;
        this.description = description;
        this.members = members;
    }
}

const dataFilePath = path.join(__dirname, 'data.json'); // Path to the data file

// Function to load data from the file if it exists
function loadData() {
    if (fs.existsSync(dataFilePath)) {
        const rawData = fs.readFileSync(dataFilePath); // Read raw data from the file
        const data = JSON.parse(rawData); // Parse the JSON data
        return {
            // Map raw data into class instances
            users: data.users.map(u => new User(u.id, u.username, u.email, u.password, u.roles, u.profileImg, u.firstName, u.lastName, u.dob, u.status)),
            groups: data.groups.map(g => new Group(g.id, g.name, g.admins, g.members, g.interested, g.description, g.groupImg)),
            channels: data.channels.map(c => new Channel(c.id, c.name, c.groupId, c.description, c.members)),
        };
    } else {
        // Return empty arrays if no data file exists
        return { users: [], groups: [], channels: [] };
    }
}

// Function to save updated data back to the file
function saveData(updatedData) {
    let currentData = { users: [], groups: [], channels: [] };

    if (fs.existsSync(dataFilePath)) {
        const rawData = fs.readFileSync(dataFilePath); // Read existing data from the file
        currentData = JSON.parse(rawData); // Parse the JSON data
    }

    // Merge the updated data with existing data
    const dataToSave = {
        users: updatedData.users || currentData.users,
        groups: updatedData.groups || currentData.groups,
        channels: updatedData.channels || currentData.channels
    };

    fs.writeFileSync(dataFilePath, JSON.stringify(dataToSave, null, 2)); // Write the updated data to the file
}

// Load initial data from the file
const { users, groups, channels } = loadData();

// Export classes and data for use in other modules
module.exports = { User, users, Channel, channels, Group, groups, saveData };

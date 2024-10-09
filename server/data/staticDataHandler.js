const fs = require('fs').promises;
const path = require('path');

// Update path to reference a JSON file
const staticFilePath = path.join(__dirname, '../data/staticData.json');

async function updateStaticFile(data, key) {
    let fileContent;
    try {
        // Read existing file content
        fileContent = await fs.readFile(staticFilePath, 'utf8');
        let existingData = JSON.parse(fileContent); // Parse JSON file
        
        // If existingData is not an object or is null, initialize it
        if (typeof existingData !== 'object' || existingData === null) {
            existingData = { groups: [], users: [], channels: [] };
        }
        
        // Ensure all keys exist
        if (!existingData.groups) existingData.groups = [];
        if (!existingData.users) existingData.users = [];
        if (!existingData.channels) existingData.channels = [];
        
        // Update only the specified part (groups, users, or channels)
        existingData[key] = data;
        
        // Write updated data back to the file as a JSON string
        fileContent = JSON.stringify(existingData, null, 2);
    } catch (error) {
        // If file doesn't exist or other error, create new content with default keys
        let newData = { groups: [], users: [], channels: [] };
        newData[key] = data;
        fileContent = JSON.stringify(newData, null, 2);
    }
    // Write the updated content to the JSON file
    await fs.writeFile(staticFilePath, fileContent, 'utf8');
}

async function readStaticFile(key) {
    try {
        const fileContent = await fs.readFile(staticFilePath, 'utf8');
        const data = JSON.parse(fileContent); // Parse JSON file
        return data[key] || [];
    } catch (error) {
        console.error(`Error reading ${key} from static file:`, error);
        return [];
    }
}

module.exports = {
    updateStaticFile,
    readStaticFile
};

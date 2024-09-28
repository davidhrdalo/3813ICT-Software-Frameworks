const fs = require('fs').promises;
const path = require('path');

const staticFilePath = path.join(__dirname, '../data/staticData.js');

async function updateStaticFile(data, key) {
    let fileContent;
    try {
        // Read existing file content
        fileContent = await fs.readFile(staticFilePath, 'utf8');
        let existingData = eval(fileContent);
        
        // If existingData is not an object or is null, initialize it
        if (typeof existingData !== 'object' || existingData === null) {
            existingData = { groups: [], users: [], channels: [] };
        }
        
        // Ensure all keys exist
        if (!existingData.groups) existingData.groups = [];
        if (!existingData.users) existingData.users = [];
        if (!existingData.channels) existingData.channels = [];
        
        // Update only the specified part (groups or users)
        existingData[key] = data;
        
        fileContent = `module.exports = ${JSON.stringify(existingData, null, 2)};`;
    } catch (error) {
        // If file doesn't exist or other error, create new content with both keys
        let newData = { groups: [], users: [] };
        newData[key] = data;
        fileContent = `module.exports = ${JSON.stringify(newData, null, 2)};`;
    }
    await fs.writeFile(staticFilePath, fileContent, 'utf8');
}

async function readStaticFile(key) {
    try {
        const fileContent = await fs.readFile(staticFilePath, 'utf8');
        const data = eval(fileContent);
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
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'softwareFrameworks';

const client = new MongoClient(uri);

async function dropDatabase() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db(dbName);
    
    await db.dropDatabase();
    console.log(`Database '${dbName}' has been dropped successfully`);
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

dropDatabase().catch(console.error);
// app.js
const express = require('express');
const  faker  = require('@faker-js/faker').faker;
const app = express();
app.use(express.json());

const MongoClient = require('mongodb').MongoClient
const port = process.env.PORT || 3000; // Define the port you want to use
const collectionName = 'collection'; // Replace with your collection name
const mongoURL = process.env.MONGO_DB_URL;
const dbName = process.env.MONGO_DB_NAME;


async function connectDB() {
  const client = new MongoClient(mongoURL);
  await client.connect();
  return client.db(dbName).collection(collectionName);
}

async function initialize() {
    const client = new MongoClient(mongoURL);
    try {
      await client.connect();
      const collection = client.db(dbName).collection(collectionName);
      await collection.deleteMany({});
      console.log('All records deleted from the collection');
      generateAndSaveDummyUsers(10).catch(console.error);
    } catch (err) {
      console.error('Error deleting records:', err);
    } finally {
      await client.close();
    }
  }

async function addFakeUser(collection){
  const fakeUser = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  };
  await collection.insertOne(fakeUser);
  console.log('Generated user:', fakeUser);
}
  
async function generateAndSaveDummyUsers(numOfUsers) {
    const collection = await connectDB();
    for (let i = 0; i < numOfUsers; i++) {
      addFakeUser(collection);
    }
    console.log('All users generated and saved!');
  }
  
// Create a new document
app.get('/api/adduser', async (req, res) => {
  try {
    const collection = await connectDB();
    // const result = await collection.insertOne(req.body);
    const fakeUser = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      password: faker.internet.password(),
      birthdate: faker.date.birthdate(),
      registeredAt: faker.date.past(),
    };
    const result = await collection.insertOne(fakeUser);
    console.log(result);
    res.status(200).json({ message: 'Data created'});
  } catch (err) {
    res.status(500).json({ message: 'Error creating data', error: err });
  }
});

// Get all documents
app.get('/api/users', async (req, res) => {
  try {
    
    const collection = await connectDB();
    const data = await collection.find({}).toArray();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error getting data', error: err });
  }
});

// Get all documents
app.get('/', async (req, res) => {
  console.log('main page is called');
  return res.status(200).json("{hello:world}")
});

// clean the database and generate new users
initialize().catch(console.error);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

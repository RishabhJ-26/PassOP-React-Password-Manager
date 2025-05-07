const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb'); 
const bodyparser = require('body-parser');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// MongoDB connection
const url = process.env.MONGO_URI; // MongoDB URI from environment variable
const client = new MongoClient(url);
client.connect();

// Database name from environment variables
const dbName = process.env.DB_NAME;

// Create an Express app
const app = express();

// Use dynamic port for production (Render) and fallback to 3000 for local development
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyparser.json());
app.use(cors({
  origin: 'https://pass-op-react-password-manager-ngee.vercel.app',
  credentials: true // only if you're using cookies, else remove this line
}));


// Route to get all passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
});

// Route to save a password
app.post('/', async (req, res) => { 
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({success: true, result: findResult});    
});

// Route to delete a password by id
app.delete('/', async (req, res) => { 
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(password);
    res.send({success: true, result: findResult});
});

// Start the server on the dynamic port
app.listen(port, () => {
    console.log(`App listening on ${process.env.PORT ? 'https://passop-react-password-manager.onrender.com' : `http://localhost:${port}`}`);
});

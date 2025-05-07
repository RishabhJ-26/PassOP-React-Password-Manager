const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb'); 
const bodyparser = require('body-parser');
const cors = require('cors');

// Load environment variables
dotenv.config();

// MongoDB connection
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();

const dbName = process.env.DB_NAME;

const app = express();

// ✅ Set CORS options
const corsOptions = {
  origin: 'https://pass-op-react-password-manager-ngee.vercel.app',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

// ✅ Apply CORS middleware before everything else
app.use(cors(corsOptions));

// Middleware
app.use(bodyparser.json());

// Routes
app.options('*', cors(corsOptions)); // ✅ Preflight support for all routes

app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
});

app.post('/', async (req, res) => { 
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({success: true, result: findResult});    
});

app.delete('/', async (req, res) => { 
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(password);
    res.send({success: true, result: findResult});
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

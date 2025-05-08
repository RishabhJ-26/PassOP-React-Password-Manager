const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser');
const cors = require('cors');

// Load environment variables from .env
dotenv.config();

// MongoDB connection
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();

const dbName = process.env.DB_NAME;

const app = express();

// ✅ CORS setup for Vercel frontend
const corsOptions = {
  origin: 'https://pass-op-react-password-manager-ngee.vercel.app',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight

// Middleware
app.use(bodyparser.json());

// Routes
app.get('/', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
});

app.post('/', async (req, res) => {
  try {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const result = await collection.insertOne(password);
    res.send({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
});

app.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const result = await collection.deleteOne({ id });
    res.send({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

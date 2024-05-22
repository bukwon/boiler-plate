const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Use the MONGO_URI environment variable for the MongoDB connection string
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("MongoDB URI is not defined. Check your .env file.");
    process.exit(1);
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

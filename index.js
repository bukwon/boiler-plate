const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const { User } = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());

// Load environment variables from .env file
dotenv.config();

// Use the MONGO_URI environment variable for the MongoDB connection string
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("MongoDB URI is not defined. Check your .env file.");
    process.exit(1);
}

mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/register', async (req, res) => {
    // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
    // DB에 넣을 수 있음

    const user = new User(req.body);

    try {
        await user.save();  // 프로미스를 사용하여 저장
        return res.status(200).json({
            success: true
        });
    } catch (err) {
        return res.json({ success: false, err });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

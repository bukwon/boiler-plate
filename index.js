const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");
const cookieParser = require('cookie-parser');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
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

app.get('/api/hello', (req, res) => {
    res.send('안녕하세요 ~');
});

app.post('/api/users/register', async (req, res) => {
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

app.post('/api/users/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            });
        }

        // 요청된 이메일이 있다면 비밀번호를 확인합니다.
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
        }

        // 비밀번호가 맞다면 토큰을 생성합니다.
        const tokenUser = await user.generateToken();
        res.cookie("x_auth", tokenUser.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });

    } catch (err) {
        return res.status(400).send(err);
    }
});

app.get('/api/users/auth', auth, async (req, res) => {
    // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role == 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        Image: req.user.Image
    });
});

app.get('/api/users/logout', auth, async (req, res) => {
    try {
        await User.findOneAndUpdate({ _id: req.user._id }, { token: "" });
        return res.status(200).send({
            success: true
        });
    } catch (err) {
        return res.json({ success: false, err });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 인증 처리를 하는곳

    // 클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    // 토큰을 복호화 한 후 유저를 찾음
    User.findByToken(token)
        .then(user => {
            if (!user) return res.json({ isAuth: false, error: true });

            req.token = token;
            req.user = user;
            next();
        })
        .catch(err => {
            throw err; // 미들웨어에서 에러 핸들링을 위해 에러를 throw
        });
};

/* let auth = (req, res, next) => {
    // 인증 처리를 하는곳

    // 클라이언트 쿠키에서 토큰을 가져옴
    let token  = req.cookies.x_auth;

    // 토큰을 복호화 한 후 유저를 찾음
    User.findByToken(token, (err, user)  =>  {
        if(err)  throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next();
    })

    // 유저가 있으면 인증 okay

    // 유저가 없으면 인증 no
} */

module.exports = { auth };
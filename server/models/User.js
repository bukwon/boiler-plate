const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlength: 255
    },
    lastname:{
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    Image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function( next ){
    var user = this;

    if  (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};


/* userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err),
        cb(null, isMatch)
    })
} */


userSchema.methods.generateToken = function () {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    return user.save().then(user => user);
};

/* userSchema.methods.generateToken = function(cb) {
    
    var user = this
    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    //  user._id + 'secretToken' = token
    //  ->

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user)
    })
} */

userSchema.statics.findByToken = function(token) {
    var user = this;

    return new Promise((resolve, reject) => {
        // user._id + '' = token
        jwt.verify(token, 'secretToken', function(err, decode) {
            if (err) return reject(err);

            user.findOne({ "_id":  decode, "token": token }, function(err, user) {
                if (err) return reject(err);
                resolve(user);
            });
        });
    });
};


/* userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // user._id + '' = token
    jwt.verify(token, 'secretToken', function(err, decode){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id":  decode, "token": token}, function(err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
} */

const User = mongoose.model('User', userSchema)

module.exports = { User }
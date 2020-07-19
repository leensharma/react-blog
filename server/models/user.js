const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }

})

/* Remember: You need to use a normal function declaration for your static function instead of using 
the arrow syntax in order to preserve Mongoose’s meaning of this within the function. */

userSchema.pre('save', function (next) {
    var user = this
    if (user.isModified('password')) {
        bcrypt.hash(user.password, saltRounds, function (err, hash) {
            if (err) return next(err)
            user.password = hash
            next()

        })
    } else {
        next()

    }

})


userSchema.methods.comparePassword = function (plainPassword, cb) {
    // Load hash from your password DB.
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    });
}

userSchema.methods.generateToken=function(cb){
    const user=this
    var token=jwt.sign(user._id.toHexString(), 'secret');

    user.token=token
    user.save((err,user)=>{
        if(err) return cb(err)
        cb(null,user)
    })

}

userSchema.statics.findByToken=function(token,cb){
    var user=this
    jwt.verify(token,'secret',function(err,decode){
        user.findOne({'_id':decode,'token':token},function(err,user){
            if(err) return cb(err)
            cb(null,user)
        })

    })
}

const User = mongoose.model("User", userSchema)

module.exports = {User}





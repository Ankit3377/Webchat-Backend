const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    url:{
        type: String,
        default: "https://i.ibb.co/ncffsWd/360-F-346839683-6n-APzbhp-Sk-Ipb8pm-Awufk-C7c5e-D7w-Yws.jpg"
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
    });

const User = mongoose.model('user', UserSchema);
module.exports = User;
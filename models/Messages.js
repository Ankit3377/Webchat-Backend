const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostsSchema = new Schema({
    senduserid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    recieveuserid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    message: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('messages', PostsSchema)
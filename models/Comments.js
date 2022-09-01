const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostsSchema = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userid'
    },
    postid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postid'
    },
    comment: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('comments', PostsSchema)
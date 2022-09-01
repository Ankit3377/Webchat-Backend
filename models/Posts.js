const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostsSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        default: "General"
    },
    url: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('posts', PostsSchema)